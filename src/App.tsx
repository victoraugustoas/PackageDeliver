import "./App.css";
import { useGenAiForAddress } from "./hooks/useGenAiForAddress/useGenAiForAddress.ts";
import { styled } from "@mui/material";
import { CameraStream } from "./components/CameraStream/CameraStream.tsx";

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
  const { getResultFromImages, loading, result } = useGenAiForAddress();

  return (
    <>
      {/*<Typography variant="h2">Identificador de endereços</Typography>*/}

      {/*<Button*/}
      {/*  component="label"*/}
      {/*  role={undefined}*/}
      {/*  variant="contained"*/}
      {/*  tabIndex={-1}*/}
      {/*  startIcon={<PhotoCamera />}*/}
      {/*  loading={loading}*/}
      {/*>*/}
      {/*  Enviar foto*/}
      {/*  <VisuallyHiddenInput*/}
      {/*    type="file"*/}
      {/*    onChange={(event) => getResultFromImages(event.target.files!)}*/}
      {/*    multiple*/}
      {/*  />*/}
      {/*</Button>*/}

      {/*<Typography variant="h3">{result}</Typography>*/}

      <CameraStream />
    </>
  );
}

export default App;
