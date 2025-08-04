import CopyAll from "@mui/icons-material/CopyAll";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useCallback, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

interface ResultListProps {
  results: { address: string; file: File }[];
}

export function ResultList(props: ResultListProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [address, setAddress] =
    useState<{ address: string; fileSrc: string }[]>();

  const onCopy = useCallback(async (result: string) => {
    try {
      await navigator.clipboard.writeText(result);
    } catch (e) {
      /* empty */
    }
  }, []);

  const formatAddress = useCallback(async () => {
    const addresses = await Promise.all(
      props.results.map(async (item) => {
        const src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = (e) => {
            resolve(e.target?.result);
          };
          reader.readAsDataURL(item.file);
        });
        return {
          address: item.address,
          fileSrc: src as string,
        };
      }),
    );
    setAddress(addresses);
  }, [props.results]);

  useEffect(() => {
    setLoading(true);
    formatAddress().then(() => setLoading(false));
  }, [formatAddress]);

  return loading ? (
    <CircularProgress />
  ) : (
    <List>
      {address!.map((item) => (
        <ListItem
          key={item.address}
          secondaryAction={
            <IconButton
              onClick={() => onCopy(item.address)}
              aria-label="comment"
            >
              <CopyAll />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar src={item.fileSrc} />
          </ListItemAvatar>

          <address>
            <ListItemText primary={item.address} />
          </address>
        </ListItem>
      ))}
    </List>
  );
}
