export default {
	
	onfileselect:async()=>{
		if(FilePicker.files[0].size >= '20000000'){
				await showModal('File_Alert_Modal');
		}else{
			if(FilePicker.files[0].name.split('.')[1]=='zip'&& FilePicker.files[0].size >= 4000000){
				await showModal('File_Alert_Modal');
			}else{
				await showAlert('File Selected','success');
			} 
		}
 },
	  
 fileUploadStruct: {
		"EstimatePO": {
		'Title': "Upload PO Files",
		'DriveId': 'b!9sncToW8AUeetDafxm9_qHQ1D99nS8NIu4I1_LuTxxjEP0Mcv7wWRoPeiPnjDKd2',
		'DriveItemId': '01WIYHH3V6Y2GOVW7725BZO354PWSELRRZ', 
		'SharepointId': 'anoralabs.sharepoint.com,4edcc9f6-bc85-4701-9eb4-369fc66f7fa8,df0f3574-4b67-48c3-bb82-35fcbb93c718',
		'ListId': '1c433fc4-bcbf-4616-83de-88f9e30ca776'
		}
 },
	 
	 fileUploadStructProd: {
		"EstimatePO": {
		'Title': "Upload Quote Files",
		'DriveId': 'b!9sncToW8AUeetDafxm9_qIKKA-4bAhtFjvt40BOkn5UZ2f5-H_OFQ6HZkIUS5qEP',
		'DriveItemId': '01FIWJAG56Y2GOVW7725BZO354PWSELRRZ', 
		'SharepointId': 'anoralabs.sharepoint.com,4edcc9f6-bc85-4701-9eb4-369fc66f7fa8,ee038a82-021b-451b-8efb-78d013a49f95',
		'ListId': '7efed919-f31f-4385-a1d9-908512e6a10f'
		}
	},
	 
	clearError: async () => {
		await storeValue('ErrorMessage', "");
		await storeValue('ErrorVisibility', false);
		await storeValue('ErrorOccured', false);
	}, 
	
	setError: async (errorMessage) => {
		await storeValue('ErrorMessage', errorMessage);
		await storeValue('ErrorVisibility', true);
		await storeValue('ErrorOccured', true);
	}, 
	 
	 getValue: (modelType, key) => {
		if(appsmith.URL.hostname=="erp-dev.anoralabs.com") {		
			return FileUploadProcess.fileUploadStruct[modelType][key];
		} else {
			return FileUploadProcess.fileUploadStructProd[modelType][key];
		}
	},
	 
	 getFileObject: async (fileName,Number,NumberName) => {
		let response="";
		let params = {'siteId': FileUploadProcess.getValue('EstimatePO', 'SharepointId'), 
									'listId': FileUploadProcess.getValue('EstimatePO', 'ListId'),
								  'Number':Number,
								  'NumberName':NumberName};
		
		response = await ListItemsDelete_Select.run(params);
		console.log('dwnld res is',response);
		if (response.value.length == 0) {
			return await FileUploadProcess.setError("No files exist!");
		}
		for(const eachFile of response.value ) {
			if (eachFile.driveItem.name == fileName){
				await storeValue('fileerror','false');
				return eachFile; 
			} 
		} 
		await storeValue('fileerror','true');
		return await FileUploadProcess.setError("Cannot find file " + fileName);
	},
	 
		runDownloadFile: async () => {
		let fileObject = await FileUploadProcess.getFileObject(ActualFileName_Input.text,appsmith.store.POId,                                                                  'POId');
		console.log(fileObject)
			
		if (appsmith.store.fileerror == 'true' ) {
			await showModal('ShowAlert_Modal');
		} else {
		let download_url = fileObject.driveItem["@microsoft.graph.downloadUrl"];
		let filename = fileObject.driveItem['name'];
		let filetype = fileObject.driveItem["file"]["mimeType"];
		
		download(download_url, filename, filetype);
		await showAlert('File Downloaded Successfully','success')
		}
	},
			
		 getFileName: async () => {
		await FileUploadProcess.clearError();
		if(POAttachments_Table.selectedRowIndex != -1) {
			return await storeValue('ActualFileName', POAttachments_Table.selectedRow.FileName);
		}
		if (FilePicker.files.length == 0) {
			return await storeValue('ActualFileName', "");
		}
		
		if (UserText_Input.text == "" || UserText_Input.isValid != true) {
			await FileUploadProcess.setError("UserText is not provided or is not valid");
			return await storeValue('ActualFileName', "");
		}
		let file_name_temp = "";
		 file_name_temp = Project_PO_Table.selectedRow.Id.toString().replace(/[^a-zA-Z0-9]/g, '').toString().trim() + "_" + UserText_Input.text.toString() + "." + FilePicker.files[0].name.split('.').pop().trim();
		
		await FileUploadProcess.clearError();
		return await storeValue('ActualFileName', file_name_temp.split(" ").join("_"));
		
	},
	
 onUploadModalClick: async () => {
		
		let tabledata=[];
		let siteId="";
		let listId="";
		Promise.all([storeValue('activetab','Empty Tab'),FileUploadProcess.testRunRefreshFunc()])
		Promise.all([siteId=FileUploadProcess.getValue('EstimatePO','SharepointId'),listId=FileUploadProcess.getValue('EstimatePO','ListId')])
		let data=await MetaData_Select.run({"siteId":siteId,"listId":listId,"NumberName":"POId","Number":appsmith.store.POId});
		console.log(data);
		
		for(let i=0;i<data.value.length;i++){
			console.log(data.value[i].fields["LinkFilename"]);
			if(data.value[i].fields["LinkFilename"]==POAttachments_Table.selectedRow.FileName){
					
						tabledata.push({"Field":"PONumber","Value":data.value[i].fields['PONumber']},
													 {"Field":"FileType","Value":data.value[i].fields['FileType']},
													 {"Field":"ModifiedBy","Value":data.value[i].fields['ModifiedBy']},
													 {"Field":'POId',"Value":data.value[i].fields['POId']},
													 {"Field":"OriginalFileName","Value":data.value[i].fields['OriginalFileName']})										
			}		  
		}
		Promise.all([storeValue('ActualFileName',POAttachments_Table.selectedRow.FileName),storeValue('tabledata',tabledata),
								 storeValue('statename','Completed'),storeValue('disable',false)]);
		
	},													
	runRefreshFunc: async () => {
		Promise.all([GlobalVariables.resetForm(['UserText_Input','FileComments_Input','FilePicker']),
			storeValue('ActualFileName', ""),storeValue('disable',false),FileUploadProcess.clearError()])
	},
	testRunRefreshFunc: async () => {
		Promise.all([resetWidget("FilePicker"),
			storeValue('ActualFileName', ""),storeValue('disable',false),FileUploadProcess.clearError()])
	}
}
	