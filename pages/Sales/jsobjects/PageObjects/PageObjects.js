export default {
	 roles_with_access :["Corporate Admin"],
	accessControl:async()=>{
		await UserRoles_Select.run()
		let role = '';
		if (UserRoles_Select.data.find((row) => row.Name === 'Sales Manager' || row.Name === 'Accounts Receivables')) {
			console.log('111')
			role = 'SalesManager'
		}else if (UserRoles_Select.data.find((row) => row.Name === 'Business Manager')) {
			console.log('222')
			role = 'BusinessManager';
		}
		await storeValue('FilterRole', role, false);
    console.log('frole', appsmith.store.FilterRole);
    await Sales_Select.run();
	},
	salescompetitionInsert:()=> {
		SalesCompetition_Insert.run(
			()=>SalesCompetition_Select.run(()=>{}, ()=>{}, {"salesId": Sales_Table.selectedRow.SalesId}), 
			()=> {}, 
			{"salesId": Sales_Table.selectedRow.SalesId, "competitionId": SC_Competition_Select.selectedOptionValue});
		GlobalVariables.resetForm(["SalesCompetition_Table"])
	},
	salesdecisionInsert:()=> {
		SalesDecision_Insert.run(()=>SalesDecision_Select.run(()=>{}, ()=>{}, {"salesId": Sales_Table.selectedRow.SalesId}), ()=>{}, {"salesId": Sales_Table.selectedRow.SalesId, "salesDecisionReasonId": SDR_Select_Input.selectedOptionValue });
	GlobalVariables.resetForm(["SalesDecision_Table"])
	},

	insertSalesRow: async () => { 
		if(await GlobalVariables.uniqueCheck("Sales", "Number", Sales_Number_Input.text)===false) {
			showAlert("Sales# not unique", "error");
		} else {
			await Sales_Insert.run();
			await Sales_Select.run({"currentStateName": appsmith.store.currentStateName});
			await ClientFilter_select.run({"currentStateName": appsmith.store.currentStateName});
			await SalesManagerFilter_Select.run({"currentStateName": appsmith.store.currentStateName});
			await SalesHistory_Insert.run({"nextState": "Lead", "salesId": Sales_Select.data[0].SalesId});
			GlobalVariables.resetForm(["Sales_Details_Container","Client_MultiSelect","SalesManager_MultiSelect", "Sales_Table"]); 
			showAlert("New Sales Added");
			// await SalesHistory_Insert.run({"nextState": "Lead"});
		} 
	},
	
	salesDetailsUpdate: async () => {
		await Sales_Update.run()
			await Sales_Select.run({"currentStateName": appsmith.store.currentStateName});
			await ClientFilter_select.run({"currentStateName": appsmith.store.currentStateName});
			await SalesManagerFilter_Select.run({"currentStateName": appsmith.store.currentStateName});
		GlobalVariables.resetForm(["Sales_Details_Container","Client_MultiSelect","SalesManager_MultiSelect", "Sales_Table"]);
		showAlert("Sales Details Updated");
	},
	
	disableFastForwardButton: (formTable) => {
		let disableFastForward = formTable.selectedRowIndex === -1?true:false;
	  return disableFastForward;
	},
	
	selectInitialState: async () => {
		await Process.clickState("Lead", ClientFilter_select,SalesManagerFilter_Select,Sales_Select);
	},
	
	salesNotesUpdate:async()=>{
		await SalesNotes_Update.run({"salesId": Sales_Table.selectedRow.SalesId,"salesNote": SalesNotes_Description_Input.text, "salesNotesId": SalesNotes_Table.selectedRow.Id, "salesNoteDate": SalesNotes_Date_Input.formattedDate});
		await SalesNotes_Select.run();
		await GlobalVariables.resetForm(["SalesNotes_Container","SalesNotes_Table" ]);
		
	},
	
	fastForwardSale:async (id , date ) =>{
		await Sales_Update_Fastforward.run({"id" : id , "date" : date})
			.then(()=>Sales_Select.run({"currentStateName": appsmith.store.currentStateName}))
			.then(()=>showAlert("Sales is moved to Signoff state and Estimate request is created", 'success'))
			.catch((error)=>showAlert("Error Occured " + error.toString(),"error"))
	},
	
	refresh: async()=>{
		await Sales_Select.run();
		await SalesBM_Select.run()
		await GlobalVariables.resetForm(["Client_MultiSelect","SalesManager_MultiSelect"]);
	},
	
	addAnotherPO: async (Description, BusinessUnitId, SalesManagerId, ClientId, CompanyId, CurrentState, date,BM) => { 
		let MaxSalesNumber = 0
		if (Sales_Number_Select.data[0].MaxSalesNumber==null) {	
					  MaxSalesNumber = (moment().format("YYMMDD")+'01')
	       } else { 
				    MaxSalesNumber = (moment().format("YYMMDD")+
															(parseInt(Sales_Number_Select.data[0].MaxSalesNumber)+1).toString().padStart(2,0));
				 }
				await NewSales_Insert.run({"Number":MaxSalesNumber, "Description":Description,
																"BusinessUnitId":BusinessUnitId,
																 "SalesManagerId":SalesManagerId, "ClientId":ClientId,
																	 "CompanyId":CompanyId, "CurrentState":CurrentState,"BM":BM});
		
		  let response = await Sales_Id_Select.run(); 
			await SalesHistory_Insert.run({"nextState": "Lead", "salesId": response[0].Id});
		  await Sales_Update_Fastforward.run({"id" :response[0].Id , "date" : date});
		  await SalesNotes_Insert.run({"salesId" :response[0].Id ,
																	 "salesNote":"Added via - Add Another PO feature", "salesNoteDate" : date});
		  await Sales_Select.run({"currentStateName": appsmith.store.currentStateName});
		
	  	Promise.all([GlobalVariables.resetForm(["Sales_Details_Container","Client_MultiSelect",
																						"SalesManager_MultiSelect", "Sales_Table","NewSales_Description_Input"]),
									 showAlert("New Sales is Created in the SignOff State to Add another PO", 'success'),
									 showAlert("New Sales Created" + " - " + response[0].Number , 'success'),closeModal('AddAnother_PO_Modal')])
		   .catch((error)=>showAlert("Error Occured " + error.toString(),"error"))
	},
	
} 
	
