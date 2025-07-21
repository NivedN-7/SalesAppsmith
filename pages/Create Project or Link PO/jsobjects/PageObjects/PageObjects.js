export default {
	columnWidth: 4,
	accessControl: async () => {
  await UserRoles_Select.run();

  const roles = UserRoles_Select.data.map(row => row.Name);
  let role = '';

  const isSales = roles.includes('Sales Manager') || roles.includes('Accounts Receivables');
  const isPM = roles.includes('Project Manager');
  const isBM = roles.includes('Business Manager');

  if (isSales) {
    role = 'SalesManager';
  } else if (isPM && isBM) {
    role = 'ProjectAndBusinessManager';
  } else if (isPM) {
    role = 'ProjectManager';
  } else if (isBM) {
    role = 'BusinessManager';
  }

  await storeValue('FilterRole', role, false);
  await Project_Select.run();
},

  insertProjectRow: async () => {
		// Performs check on the table and then inserts a new row in the Project table. 
		// Also performs a resetForm after the project is added. 
		if(await GlobalVariables.uniqueCheck("Project", "Number", Project_Number_Input.text)===false) {
			showAlert("Project# not unique", "error");
		} else {
			await Project_Insert.run().then(()=>{
				return Promise.all([GlobalVariables.filterTableData()]); 
			})
				.then(()=> {return GlobalVariables.resetWidgets(["Project_Select_Table", "Project_Edit_Container"])})
				.then((res)=> showAlert("Done", "success"))
				.catch((error)=> showAlert(error.toString(), "error"));
		} 
	},
	
  updateProjectRow: async () => {
		// Edit project details. 
		await Project_Update.run().then((response)=>{
			return Promise.all([GlobalVariables.filterTableData()])
		})
			.then(() => GlobalVariables.resetWidgets(["Project_Edit_Container"]))
			.then(()=> showAlert("Done", "success"))
			.catch((error) => showAlert(error.toString(), "error"))
	},
	
	deleteProjectRow: async () => {
		await Project_Delete.run().then((response) => {
			return Promise.all([GlobalVariables.filterTableData()])
		})
			.then(() => GlobalVariables.resetWidgets(["Project_Select_Table", "Project_Edit_Container"]))
			.then(()=> showAlert("Done", "success"))
			.catch((error) => showAlert(error.toString(), "error"));
	},	
	checkPOnumber: async () => {
  try {
    await ApproverMail_Select.run({ POId: PONumber_Select_Input.selectedOptionValue });
    const isUnique = await GlobalVariables.checkUnique(
      "ProjectId = " + Project_Select_Table.selectedRow.Id,
      "ProjectPO",
      "PurchaseOrderId",
      PONumber_Select_Input.selectedOptionValue
    );
    if (!isUnique) {
      showAlert("PO number exists", "error");
      return;
    }
    await PO_Number_Insert.run();
    await TeamsNotification.GroupMessage();
    
    await Promise.all([
      Project_PO_Select.run(),
      GlobalVariables.resetForm(["ProjectNumber_Input", "PONumber_Select_Input"]),
      closeModal("ProjectPO_Modal"),
    ]);

    showAlert("Values added");
  } catch (error) {
    showAlert("Action failed", "error");
    console.error(error);
  }
},

	projectNum:()=>{
		if (Project_Select_Table.selectedRowIndex != -1 && (Client_Project_Select.data?.find((row) =>
 row.Code ==Client_Select_Input.selectedOptionValue)?.Id==Project_Select_Table.selectedRow.ClientId)&& (BUProject_Select.data?.find((row) =>
 row.Code ==BU_Select_Input.selectedOptionValue)?.Id==Project_Select_Table.selectedRow.BusinessUnitId)){
			return(Project_Select_Table.selectedRow.Number)
		}
		if((Client_Select_Input.selectedOptionValue =="")|| (BU_Select_Input.selectedOptionValue =="") ){
			return("")
		}
		else if (ProjectNumberSort.data[0]["MaxNum"]==null){
			return((BU_Select_Input.selectedOptionValue + Client_Select_Input.selectedOptionValue )+"001") 
	}
		else{
			return(parseInt(ProjectNumberSort.data[0]["MaxNum"])+1)
		}
		
	}
}