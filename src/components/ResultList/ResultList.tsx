import CopyAll from "@mui/icons-material/CopyAll";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useCallback } from "react";

interface ResultListProps {
  results: { address: string; fileBase64: string }[];
}

export function ResultList(props: ResultListProps) {
  const onCopy = useCallback(async (result: string) => {
    try {
      await navigator.clipboard.writeText(result);
    } catch (e) {
      /* empty */
    }
  }, []);

  return (
    <List>
      {props.results.map((item) => (
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
            <Avatar src={item.fileBase64} />
          </ListItemAvatar>

          <address>
            <ListItemText primary={item.address} />
          </address>
        </ListItem>
      ))}
    </List>
  );
}
