import React from "react";

import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Select,
  Typography,
} from "../../node_modules/@mui/material/index";
import { TreeItem, TreeView, useTreeItem } from "@mui/lab";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ClearIcon from "@mui/icons-material/Clear";

import clsx from "clsx";

function TreeSelect(props) {
  const TreeContext = React.createContext();

  let inputLabel = props.label;
  let value = props.value;
  let setValue = props.setValue || props.setvalue;
  let options = props.options;


  /**
   * Remove props that shall not be passed down to the Select Component
   */
  let selectProps = {
    ...props,
  }
  delete selectProps.setValue;
  delete selectProps.setvalue;

  // -- MUI Tree
  function getTreeItems(option) {
    return (
      <CustomTreeItem
        key={Math.random()}
        nodeId={
          option.readOnly ? "readOnly:" + option.id : "value:" + option.id
        }
        customicon={option.icon}
        label={option.name}
      >
        {option?.children.map((child) => {
          return getTreeItems(child);
        })}
      </CustomTreeItem>
    );
  }

  function CustomTreeItem(props) {
    const CustomContent = React.forwardRef(function CustomContent(props, ref) {
      const {
        classes,
        className,
        label,
        nodeId,
        icon: iconProp,
        customicon,
        expansionIcon,
        displayIcon,
      } = props;

      const {
        disabled,
        expanded,
        selected,
        focused,
        handleExpansion,
        handleSelection,
        preventSelection,
      } = useTreeItem(nodeId);

      const icon = iconProp || expansionIcon || displayIcon;

      const handleMouseDown = (event) => {
        preventSelection(event);
      };

      const handleExpansionClick = (event) => {
        handleExpansion(event);
      };

      const handleSelectionClick = (event) => {
        handleSelection(event);
      };

      return (
        <Box
          className={clsx(className, classes.root, {
            [classes.expanded]: expanded,
            [classes.selected]: selected,
            [classes.focused]: focused,
            [classes.disabled]: disabled,
            treeItem: true,
          })}
          onMouseDown={handleMouseDown}
          ref={ref}
          sx={{
            "&": {
              borderRadius: 8,
            },
            "&:hover .actions": {
              backgroundColor: "!important blue",
              color: "red",
              visibility: "visible",
            },
          }}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div onClick={handleExpansionClick} className={classes.iconContainer}>
            {icon}
          </div>

          <div>{customicon}</div>

          <Box
            sx={{
              display: "flex",
              flexGrow: "1",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              onClick={handleSelectionClick}
              className={classes.label}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      );
    });

    return (
      <TreeItem
        ContentComponent={CustomContent}
        ContentProps={{
          customicon: props.customicon,
        }}
        {...props}
      />
    );
  }

  const [isOpen, setIsOpen] = React.useState(false);

  function getOption(needle, haystack) {
    for (let i = 0; i < haystack.length; i++) {
      if (haystack[i].id === needle && !haystack[i].readOnly) {
        return haystack[i];
      } else {
        let result = getOption(needle, haystack[i].children);
        if (result) {
          return result;
        }
      }
    }
  }

  function getOptionName(id) {
    return getOption(id, options).name;
  }

  return (
      <Select

        {...selectProps}
        onClose={(e) => {
          setIsOpen(false);
        }}
        onOpen={(e) => {
          setIsOpen(true);
        }}
        open={isOpen}
        renderValue={function (value) {
          value = Number.parseInt(value);

          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >


              <Typography>{getOptionName(value)}</Typography>

              <InputAdornment
                onMouseDown={function (e) {
                  e.stopPropagation();
                  setValue(null);
                }}
                position="end"
              >
                <IconButton size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            </Box>
          );
          // return <Typography> {getOptionName(value)} </Typography>;
        }}
      >
        <TreeContext.Provider value={{ d: null }}>
          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              mt: 1,
              flexGrow: 1,
              maxHeight: "100%",
              overflowY: "auto",
            }}
            onNodeSelect={function (e, nodeIds) {
              let [type, assetId] = nodeIds.split(":");
              if (type !== "value") {
                return;
              }

              setValue(assetId);
              setIsOpen(false);

              console.log(assetId);
              // fire handleChange event
              setValue(assetId);
            }}
          >
            {options.map((option) => {
              return getTreeItems(option);
            })}
          </TreeView>
        </TreeContext.Provider>
      </Select>
  );
}

export default TreeSelect;
