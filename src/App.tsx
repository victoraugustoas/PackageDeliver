import { PhotoCamera } from "@mui/icons-material";
import "./App.css";
import { useGenAiForAddress } from "./hooks/useGenAiForAddress/useGenAiForAddress.ts";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { styled, TextField } from "@mui/material";
import { ResultList } from "./components/ResultList/ResultList.tsx";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function App() {
  const [roomId, setRoomId] = useState<string>("");
  const { getResultFromImages, loading, results } = useGenAiForAddress({
    roomId,
  });

  console.log(results);

  return (
    <>
      <Typography variant="h3">Identificador de endereços</Typography>

      <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <TextField
          id="outlined-basic"
          label="Room ID"
          variant="outlined"
          onChange={(event) => setRoomId(event.target.value)}
        />
      </div>

      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<PhotoCamera />}
        loading={loading}
      >
        Enviar foto
        <VisuallyHiddenInput
          type="file"
          onChange={(event) => getResultFromImages(event.target.files!)}
          multiple
        />
      </Button>

      <ResultList results={results} />
    </>
  );
}

export default App;
