import MotionHoc from "./MotionHoc";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import DataTable from "react-data-table-component";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const HomeComponent = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [originalData, setOriginalData] = useState([]);

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    setData(list);
    setOriginalData(list);
    setColumns(columns);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  function callThisFunc(search) {
    var searchData = search.target.value;
    setSearch(searchData);
    if (searchData.length === 0) {
      setData(originalData);
    } else {
      var filteredData = [];
      for (var i = 0; i < originalData.length; i++) {
        console.log(JSON.stringify(data[i]));
        if (JSON.stringify(originalData[i]).includes(searchData)) {
          filteredData.push(originalData[i]);
        }
      }
      setData(filteredData);
    }
  }

  const mystyle = {
    width: "200px",
    float: "right",
    paddingBottom: "10px",
  };

  const dataStyle = {
    width: "100%",
    height: "100%",
    padding: "10px",
    display: "block",
    align: "center",
    justify: "center",
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  return (
    <div>
      <div style={dataStyle}>
        <ThemeProvider theme={darkTheme}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting}>
                <TextField
                  id="outlined-basic"
                  label="Outlined"
                  variant="outlined"
                  size="small"
                  margin="dense"
                  onChange={callThisFunc}
                />
              </MenuItem>
            ))}
          </Menu>
        </ThemeProvider>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
        <div style={mystyle}>
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            size="small"
            margin="dense"
            onChange={callThisFunc}
          />
        </div>

        <div style={{height:"500px",width:"100%",overflow:"auto",paddingBottom:"10px"}}>
          <DataTable
            style={{ dataStyle }}
            fixedHeader
            responsive
            theme="dark"
            pagination
            paginationPerPage={10}
            highlightOnHover
            columns={columns}
            data={data}
          />
        </div>
      </div>
    </div>
  );
};

const Home = MotionHoc(HomeComponent);

export default Home;
