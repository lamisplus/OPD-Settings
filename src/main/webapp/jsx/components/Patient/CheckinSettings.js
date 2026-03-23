import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import axios from "axios";

import { token as token, url as baseUrl } from "../../../api";
import { forwardRef } from "react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import "@reach/menu-button/styles.css";
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import { TiDeleteOutline, TiEdit } from "react-icons/ti";
import { Box } from "@material-ui/core";
Moment.locale("en");
momentLocalizer();

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const CheckinSettings = (props) => {
  const [loading, setLoading] = useState("");
  const [enablePPI, setEnablePPI] = useState(true);
  const [tabRecords, setTabRecords] = useState([]);

  const fetchRemoteData = (query) => {
    axios
      .get(
        `${baseUrl}opd-setting?pageSize=${query?.pageSize}&pageNo=${query?.page}&searchParam=${query?.search}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((response) => response)
      .then((result) => {
        setTabRecords({
          data: result?.data?.map?.((row) => ({
            name: [row?.firstName, row?.otherName, row?.surname]
              .filter(Boolean)
              .join(", "),
            id: row?.id,
            facilityId: row?.facilityId,
            serviceName: row?.moduleServiceName,
            serviceCode: row?.moduleServiceCode,
            encounter: row?.encounter,

            actions: (
              <div>
                <ButtonGroup variant="contained" aria-label="split button">
                  <Link
                    to={{
                      pathname: "/patient-history",
                      state: {
                        patientId: row.id,
                        patientObj: row,
                      },
                    }}
                  >
                    <Button
                      startIcon={
                        <TiEdit
                          size=".65em"
                          style={{
                            color: "#fff",
                            fontWeight: "bolder",
                            whiteSpace: "nowrap",
                            marginRight: 0,
                          }}
                        />
                      }
                      style={{
                        backgroundColor: "rgb(153, 46, 98)",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    >
                      <span
                        style={{
                          color: "#fff",
                        }}
                      >
                        Edit
                      </span>
                    </Button>
                  </Link>

                  <Button
                    onClick={() => {
                      handleDelete(row?.id);
                    }}
                    startIcon={
                      <TiDeleteOutline
                        size=".65em"
                        style={{
                          color: "#fff",
                          fontWeight: "bolder",
                          whiteSpace: "nowrap",
                        }}
                      />
                    }
                    style={{ backgroundColor: "rgb(153, 46, 98)" }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#fff",
                        fontWeight: "bolder",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Delete
                    </span>
                  </Button>
                </ButtonGroup>
              </div>
            ),
          })),
          page: query?.page,
          totalCount: result.data.totalRecords,
        });
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`${baseUrl}opd-setting/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        fetchRemoteData();
        return response.data;
      });
  };

  useEffect(async () => {
    fetchRemoteData();
  }, []);

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: "Id",
            field: "id",
            filtering: false,
          },
          { title: "Hosp. Number", field: "facilityId", filtering: false },
          { title: "Service Name", field: "serviceName", filtering: false },
          { title: "Service Code", field: "serviceCode", filtering: false },
          { title: "Encounter Type", field: "encounter", filtering: false },
          { title: "Actions", field: "actions", filtering: false },
        ]}
        isLoading={loading}
        data={tabRecords.data}
        options={{
          headerStyle: {
            backgroundColor: "#014d88",
            color: "#fff",
            fontSize: "16px",
            padding: "10px",
            fontWeight: "bolder",
          },
          searchFieldStyle: {
            width: "50%",
          },
          filtering: false,
          exportButton: false,
          searchFieldAlignment: "left",
          pageSizeOptions: [10, 20, 100],
          pageSize: 10,
          debounceInterval: 400,
          sorting: true,
        }}
      />
    </div>
  );
};

export default CheckinSettings;
