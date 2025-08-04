import { AddressSchema } from "../../domain/Address.schema.ts";
import { getGenerativeModel, type Part } from "firebase/ai";
import { useFirebase } from "../../context/FirebaseContext.tsx";
import { PromptAddress } from "../../domain/Prompt.ts";
import { useCallback, useState } from "react";
import type { Address } from "../../domain/Address.types.ts";

async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}

export function useGenAiForAddress() {
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{ address: string; file: File }[]>([]);

  const { googleAI } = useFirebase();
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
            model.generateContent([PromptAddress, imagePart as Part]),
          ),
        );

        const toAddress = (address: Address) =>
          `${address.address}, ${address.number}, ${address.neighborhood}, ${address.city}`;
        const addresses = promptResults.map((result) => {
          return toAddress(JSON.parse(result.response.text()));
        });
        setResults(
          addresses.map((address, index) => ({ address, file: files[index] })),
        );
      } catch (e) {
        /* empty */
      } finally {
        setLoading(false);
      }
    },
    [model],
  );

  return { getResultFromImages, loading, results };
}
