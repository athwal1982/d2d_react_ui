const APIEndpoints = {
  ServcieMaster: {
    AddService: "DTDS/AddService",
    GetService: "DTDS/GetService",
    UpdateService: "DTDS/UpdateService",
    ServiceTypeAssignManage: "DTDS/ServiceTypeAssignManage",
    ServiceTypeDocumentAssignManage: "DTDS/ServiceTypeDocumentAssignManage",
    AppointmentFeesUpdate: "DTDS/AppointmentFeesUpdate",
    UpdateAgentVisitingFees: "DTDS/UpdateAgentVisitingFees",
    UpdateVLEMapAutoMode: "DTDS/UpdateVLEMapAutoMode",
    AddBulkTempService: "DTDS/AddBulkTempService",
    AddBulkStateService: "DTDS/AddBulkStateService",
  },
  DocumentMaster: {
    GetDocument: "DTDS/GetDocument",
    AddDocument: "DTDS/AddDocument",
    UpdateDocument: "DTDS/UpdateDocument",
    DocumentAssignManage: "DTDS/DocumentAssignManage",
  },
};

export default APIEndpoints;
