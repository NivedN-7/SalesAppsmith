export default {
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
    await Estimate_Select.run();
	},
	insertEstimateItemRow: async () => {
		/*return GlobalVariables.uniqueCheck("EstimateItem", "Number", EI_Number_Input.text)
			.then((res)=> showAlert("Success!", "success"), (err) => showAlert("In the then " + err.toString(), "error"));*/
		return GlobalVariables.uniqueCheck("EstimateItem", "Number", EI_Number_Input.text)
			.then((response) => {
				return EstimateItem_Insert.run()
					.then(()=> EstimateItem_Select.run())
					.then(()=> Promise.all([GlobalVariables.resetWidgets(["EstimateItem_Table", "EI_Input_Form"]), showAlert("EstimateItem Inserted", "success")]))
					.catch((err)=> showAlert(err.toString(), "error")); }, 
						(error) => showAlert("Duplicate EstimateItem Number", "error"));
	},
	
	updateEstimateItemRow: async () => {
		return EstimateItem_Update.run()
					.then(()=> EstimateItem_Select.run())
					.then(()=> Promise.all([GlobalVariables.resetWidgets(["EstimateItem_Table", "EI_Input_Form"]), showAlert("EstimateItem Updated", "success")]))
					.catch((err)=> showAlert(err.toString(), "error"));
	},
	
	deleteEstimateItemRow: async () => {
				return EstimateItem_Delete.run()
					.then(()=> EstimateItem_Select.run())
					.then(()=> Promise.all([GlobalVariables.resetWidgets(["EstimateItem_Table", "EI_Input_Form"]), showAlert("EstimateItem Deleted", "success")]))
					.catch((err)=> showAlert(err.toString(), "error"));
	},
}