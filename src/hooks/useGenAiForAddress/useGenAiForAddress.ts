import { AddressSchema } from "../../domain/Address.schema.ts";
import { getGenerativeModel, type Part } from "firebase/ai";
import { useFirebase } from "../../context/FirebaseContext.tsx";
import { PromptAddress } from "../../domain/Prompt.ts";
import { useCallback, useState } from "react";
import type { Address } from "../../domain/Address.types.ts";

async function fileToGenerativePart(file: FileList) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(file[0]);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file[0].type,
    },
  };
}

export function useGenAiForAddress() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

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
      const imagePart = await fileToGenerativePart(files);
      const promptResult = await model.generateContent([
        PromptAddress,
        imagePart as Part,
      ]);

      const response = promptResult.response;
      const address: Address = JSON.parse(response.text());
      const result = `${address.address}, ${address.number}, ${address.neighborhood}, ${address.city}`;

      try {
        const permissionStatus = await navigator.permissions.query({
          name: "clipboard-write",
        });
        if (permissionStatus.state === "granted") {
          await navigator.clipboard.writeText(result);
        }
      } catch (e) {
        /* empty */
      }

      setResult(result);
      setLoading(false);
    },
    [model],
  );

  return { getResultFromImages, loading, result };
}
