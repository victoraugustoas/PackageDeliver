import { AddressSchema } from "../../domain/Address.schema.ts";
import { getGenerativeModel } from "firebase/ai";
import { useFirebase } from "../../context/FirebaseContext.tsx";
import { PromptAddress } from "../../domain/Prompt.ts";
import { useCallback, useEffect, useState } from "react";
import type { Address } from "../../domain/Address.types.ts";
import {
  collection,
  doc,
  onSnapshot,
  query,
  writeBatch,
} from "firebase/firestore";

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: (await base64EncodedDataPromise) as string,
      mimeType: file.type,
    },
  };
}

export function useGenAiForAddress({ roomId }: { roomId: string }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<
    { address: string; fileBase64: string }[]
  >([]);

  const { googleAI, firestore } = useFirebase();
  const model = getGenerativeModel(googleAI, {
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: AddressSchema,
    },
  });

  const getResultFromImages = useCallback(
    async (files: FileList) => {
      setLoading(true);

      try {
        const images = await Promise.all(
          Array.from(files).map(fileToGenerativePart),
        );
        const promptResults = await Promise.all(
          images.map((imagePart) =>
            model.generateContent([
              PromptAddress,
              {
                inlineData: {
                  data: imagePart.inlineData.data.split(",")[1],
                  mimeType: imagePart.inlineData.mimeType,
                },
              },
            ]),
          ),
        );

        const toAddress = (address: Address) =>
          `${address.address}, ${address.number}, ${address.neighborhood}, ${address.city}`;
        const addresses = promptResults.map((result) => {
          return toAddress(JSON.parse(result.response.text()));
        });
        const results = addresses.map((address, index) => ({
          address,
          fileBase64: images[index].inlineData.data,
        }));
        setResults(results);

        if (!roomId) return;
        try {
          const batch = writeBatch(firestore);
          const collectionRef = collection(firestore, roomId);
          for (const address of results) {
            const newDocRef = doc(collectionRef, address.address); // Automatically generate document ID
            batch.set(newDocRef, { address: address.address });
          }
          await batch.commit();
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } catch (e) {
        /* empty */
      } finally {
        setLoading(false);
      }
    },
    [firestore, model, roomId],
  );

  useEffect(() => {
    if (!roomId) return;

    async function getRoomDocs() {
      try {
        console.log("getting room docs");
        setLoading(true);
        const q = query(collection(firestore, roomId));
        onSnapshot(q, (querySnapshot) => {
          setResults(
            querySnapshot.docs.map(
              (doc) => doc.data() as { address: string; fileBase64: string },
            ),
          );
        });
        console.log("finished getting room docs");
      } catch (e) {
        /* empty */
      } finally {
        setLoading(false);
      }
    }

    getRoomDocs();
  }, [firestore, roomId]);

  return { getResultFromImages, loading, results };
}
