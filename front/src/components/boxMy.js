import * as React from "react";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

import DeleteIcon from '@mui/icons-material/Delete';
export default function BoxMy(props) {
    var styles = {

        container: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
    
        topBox: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'right',
            alignItems: 'center',
        }
    };
  return (
    <div>
      <Paper variant="outlined">
        <div>
          <span>{props.data}</span>{" "}
          <div style={styles.container}>
          <IconButton style={styles.topBox} aria-label="delete">
            <DeleteIcon />
          </IconButton>
          </div>
        </div>
      </Paper>
    </div>
  );
}
