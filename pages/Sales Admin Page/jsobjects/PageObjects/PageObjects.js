export default {
	
	//code for insert values in all tabs with uniqueCheck function to prevent insert of duplicate values
	salestateCreate:async()=>{
		if(await GlobalVariables.uniqueCheck('SalesState','Name',SalesState_Name_Input.text)===false){
			showAlert('duplicate name');
	  } else {
			SalesState_Insert.run(()=>SalesState_Select.run(()=>showAlert('Values inserted')));
	  }
	},
	salesreasonCreate:async()=>{
		if(await GlobalVariables.uniqueCheck('SalesDecisionReason','Name',SalesReason_Reason_Input.text)===false){
			showAlert('duplicate reason');
	  } else {
			SalesDecisionReason_Insert.run(()=>SalesDecisionReason_Select.run(()=>showAlert('Values inserted')));
    }
	},
	
	//code for disable create buttons for all tabs
	disablesalesstateCreate:()=> {
		return (GlobalVariables.disableCreateButton([SalesState_Order_Input,SalesState_Name_Input]))
	},
	disablesalesreasonCreate:()=> {
		return (GlobalVariables.disableCreateButton([SalesReason_Order_Input,SalesReason_Reason_Input]))
	},
}