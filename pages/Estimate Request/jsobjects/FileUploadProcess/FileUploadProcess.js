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
		"Estimate": {
		'Title': "Upload Estimate Files",
		'DriveId': 'b!9sncToW8AUeetDafxm9_qHQ1D99nS8NIu4I1_LuTxxhFBoTD6JZkSL8HEOFz7lmD',
		'DriveItemId': '01WIYHH3V6Y2GOVW7725BZO354PWSELRRZ', 
		'SharepointId': 'anoralabs.sharepoint.com,4edcc9f6-bc85-4701-9eb4-369fc66f7fa8,df0f3574-4b67-48c3-bb82-35fcbb93c718',
		'ListId': 'c3840645-96e8-4864-bf07-10e173ee5983'
		}
 },
	 
	 fileUploadStructProd: {
		"Estimate": {
		'Title': "Upload Quote Files",
		'DriveId': 'b!9sncToW8AUeetDafxm9_qIKKA-4bAhtFjvt40BOkn5XtKNEpD9XARYwkJQ0apjy6',
		'DriveItemId': '01FIWJAG56Y2GOVW7725BZO354PWSELRRZ', 
		'SharepointId': 'anoralabs.sharepoint.com,4edcc9f6-bc85-4701-9eb4-369fc66f7fa8,ee038a82-021b-451b-8efb-78d013a49f95',
		'ListId': '29d128ed-d50f-45c0-8c24-250d1aa63cba'
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
		let params = {'siteId': FileUploadProcess.getValue('Estimate', 'SharepointId'), 
									'listId': FileUploadProcess.getValue('Estimate', 'ListId'),
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
		let fileObject = await FileUploadProcess.getFileObject(ActualFileName_Input.text,appsmith.store.ESalesId,                                                                  'SalesId');
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
		if(EstimateAttachments_Table.selectedRowIndex != -1) {
			return await storeValue('ActualFileName', EstimateAttachments_Table.selectedRow.FileName);
		}
		if (FilePicker.files.length == 0) {
			return await storeValue('ActualFileName', "");
		}
		
		if (UserText_Input.text == "" || UserText_Input.isValid != true) {
			await FileUploadProcess.setError("UserText is not provided or is not valid");
			return await storeValue('ActualFileName', "");
		}
		let file_name_temp = "";
		 file_name_temp = Estimate_Table.selectedRow.EId.toString().replace(/[^a-zA-Z0-9]/g, '').toString().trim() + "_" + UserText_Input.text.toString() + "." + FilePicker.files[0].name.split('.').pop().trim();
		
		await FileUploadProcess.clearError();
		return await storeValue('ActualFileName', file_name_temp.split(" ").join("_"));
		
	},
	
 onUploadModalClick: async () => {
		
		let tabledata=[];
		let siteId="";
		let listId="";
		Promise.all([storeValue('activetab','Empty Tab'),FileUploadProcess.testRunRefreshFunc()])
		Promise.all([siteId=FileUploadProcess.getValue('Estimate','SharepointId'),listId=FileUploadProcess.getValue('Estimate','ListId')])
		let data=await MetaData_Select.run({"siteId":siteId,"listId":listId,"NumberName":"SalesId","Number":appsmith.store.ESalesId});
		console.log(data);
		
		for(let i=0;i<data.value.length;i++){
			console.log(data.value[i].fields["LinkFilename"]);
			if(data.value[i].fields["LinkFilename"]==EstimateAttachments_Table.selectedRow.FileName){
					
						tabledata.push({"Field":"SalesNumber","Value":data.value[i].fields['SalesNumber']},
													 {"Field":"FileType","Value":data.value[i].fields['FileType']},
													 {"Field":"ModifiedBy","Value":data.value[i].fields['ModifiedBy']},
													 {"Field":'SalesId',"Value":data.value[i].fields['SalesId']},
													 {"Field":'EstimateId',"Value":data.value[i].fields['EstimateId']},
													 {"Field":"OriginalFileName","Value":data.value[i].fields['OriginalFileName']})
											
			}
			  
		}
		Promise.all([storeValue('ActualFileName',EstimateAttachments_Table.selectedRow.FileName),storeValue('tabledata',tabledata),
								 storeValue('statename','Completed'),storeValue('disable',false)]);
		
	},
	
	retryfunction:async()=>{
		if(appsmith.store.add==1){
			await FileUploadProcess.runCreateFile(Estimate_Table.selectedRow.Id,FileComments_Input.text);
		}else if(appsmith.store.add==2){
			await FileUploadProcess.runModifyFile(EstimateAttachments_Table.selectedRow.Id,FileComments_Input.text)
		}else{
			await FileUploadProcess.setError('value error in retry');
		}		
	},
		 
 runCreateFile: async (EId, Comments ) => {
		// Check for duplicate.
		// if yes, raise Error
		// else, create entry in db.
		// upload file. 
		// update file metadata. 
		try
		{
				let statename=appsmith.store.statename==null?storeValue('statename','FileCheck'):appsmith.store.statename
				let progressstatus=appsmith.store.progressstatus==null?storeValue('progressstatus','0'):appsmith.store.progressstatus
				let retry=0;
				await FileUploadProcess.clearError();
				await storeValue('closedisable','False');
				if(appsmith.store.statename=='Completed'){
					statename="FileCheck"; 
					progressstatus=0;
					await storeValue('statename',statename);
					await storeValue('progressstatus',progressstatus);
				}
				showModal('Progress_Modal');
				let fileParams = { 
													 "ModifiedBy":appsmith.user.email.split("@")[0],
					                 "FileType":FilePicker.files[0].name.split('.').pop().trim(),
					                 "SalesNumber":Estimate_Table.selectedRow.Number,
													 "SalesId":Estimate_Table.selectedRow.Id,
													 "EstimateId":Estimate_Table.selectedRow.EId,
					                 "OriginalFileName":FilePicker.files[0].name
				}
				let DriveId = FileUploadProcess.getValue('Estimate', 'DriveId');
				let DriveItemId = FileUploadProcess.getValue('Estimate', 'DriveItemId');
				
				while(statename != 'Completed')
				{
						console.log(progressstatus);
						console.log(statename);
						if(statename!='Error'){
							await storeValue('statename',statename);
							await storeValue('progressstatus',progressstatus);
						}
						
						switch(statename)
						{
								case 'FileCheck':
										let response = await SpecificFilesInDrive_Select.run({'DriveId': DriveId, 
																																					'DriveItemId': DriveItemId,
																																					'FileName':ActualFileName_Input.text});
										console.log(response,'response')
										if (response.value.length == 0) {			
													statename='UploadToSharePoint'
													progressstatus=25;
										}     
										else
										{
												await FileUploadProcess.setError("File Name Not Unique! Enter different user ");
												statename='Error';
										}
										
										break;
								case 'DBInsert':
			
												await EAttachments_Insert.run({"EId":EId, "FileName":appsmith.store.ActualFileName, "Comments":Comments})
												.then(() => EAttachments_Select.run({"EId":EId}))
												statename='UpdateMetadata';
												progressstatus=75;
								    		break;
       
							case 'UploadToSharePoint':
								     let uploadurl=await UploadSession_Create.run({'DriveId':DriveId,'DriveItemId':DriveItemId,'fileName':ActualFileName_Input.text});
											console.log('uploadurl is',uploadurl.uploadUrl);
											let filesize=FilePicker.files[0].size;
											let startindex=0;
											let responsecreate = "";
											let upload_chunk = filesize;
											let endindex=filesize-1; 
											responsecreate = await FileUpload_Create.run(()=>{},()=>{},{'uploadurl':UploadSession_Create.data.uploadUrl.split('//')[1],'range':upload_chunk,
																											 'startindex':startindex,'endindex':endindex,'filesize':filesize});
											console.log('responsecreate is',FileUpload_Create.data);
											console.log('name',FileUpload_Create.data.name,"Name")
											if(FileUpload_Create.data.length!=0){
												if(FileUpload_Create.data.name == ActualFileName_Input.text){ //check uploaded or not
													statename='DBInsert';
													progressstatus=50;
												}
											}
											else if(retry==0)
											{
												retry++;
												await FileUploadProcess.setError("Upload Failed in first attempt, attempting second");
											}
											else{
												await FileUploadProcess.setError("Upload Failed!, File Upload Create Response not valid");
												statename='Error';
											}
											break;
							case 'UpdateMetadata':
										let responsemetadata="";
										responsemetadata = await FileUploadProcess.modifyFileMetadata(
																																									appsmith.store.ActualFileName, 
																																									fileParams,
																																								  'SalesId',
																																								  Estimate_Table.selectedRow.Id);
										
										console.log('metadata',responsemetadata);
										if(FileMetadata_Create.data.length!=0){
											if(FileMetadata_Create.data.SalesId==Estimate_Table.selectedRow.Id){
												statename='Completed'
												progressstatus=100;
											}
										}
										else if(retry==0)
										{ 
												retry++;
												await FileUploadProcess.setError("First Attempt for Metadata is failed, Attempting Second");
										}
										else{
												await FileUploadProcess.setError("Upload Failed!, Metadata create response not valid");
												statename='Error';
										}
						 				break;
							case 'Error':
										await storeValue('closedisable','True');
										statename='Completed';
										break;						
					}
			}
			await storeValue('statename',statename)
			await storeValue('progressstatus',progressstatus);
			if(appsmith.store.statename=='Completed'&&appsmith.store.ErrorMessage==''){
			  await FileUploadProcess.runRefreshFunc()
			  .then(()=>closeModal('Progress_Modal'))
				.then(()=>Promise.all([showModal('FileUpload_Modal'),EAttachments_Select.run({"EId":Estimate_Table.selectedRow.EId})]))
				.then(()=>showAlert('Estimate File Inserted','success'))
				.then(()=>FileUpload_Check.run({'EId':Estimate_Table.selectedRow.EId}))
			}
		}
		catch(err)
			{
				if(err.message=="Cannot read properties of undefined (reading 'data')"){
							Promise.all([FileUploadProcess.setError("Network got disconnected!, Please check your connection and retry"),
													storeValue('closedisable','True'),showAlert('Network got disconnected!, Please check your connection and retry','error')])
				 	
				}else{
							Promise.all([FileUploadProcess.setError("Upload Failed retry, " + err.message),
													 storeValue('closedisable','True'),showAlert("Upload Failed retry, " 
													 +err.message,'error')])
				}
			}
	
	},
		
 modifyFileMetadata: async (fileName, fileParams, NumberName,Number) => {
		// Get a file name and the type of document (component, assembly or manufacturing)
		// Steps:
		// Get File Id from the sharepoint list.
		// Send the metadata with the API call. 
		//console.log("meta check1")
		let response="";
		//console.log(fileCategory);
		let params = {'siteId': FileUploadProcess.getValue('Estimate', 'SharepointId'), 
									'listId': FileUploadProcess.getValue('Estimate', 'ListId'),
								  'NumberName': NumberName,
									'Number':Number 
								 };
		if(EstimateAttachments_Table.selectedRowIndex==-1){
				console.log(params,'metabreak');
				response = await ListItemMetaDataCreate_Select.run(params);
			console.log(response);
		}else{
				response = await ListItemsDelete_Select.run(params);
		}
		if (response.value.length == 0) {
			return await FileUploadProcess.setError("No files exist!");
		}
		for(const eachFile of response.value ) {
			console.log("eachfile",eachFile)
			if (eachFile.driveItem.name == fileName){
				console.log("eachfile",eachFile)
				// console.log("File found");
				// console.log(fileParams);
				let query_params = {
					'siteId': FileUploadProcess.getValue('Estimate', 'SharepointId'), 
					'listId': FileUploadProcess.getValue('Estimate', 'ListId'),
					'listItemId': eachFile.id,
					'fileParams': fileParams,
				};
				console.log(query_params)
				return await FileMetadata_Create.run(query_params);
				
			}
		}	
	},
														
runModifyFile: async (FileId, FileComments) => {
		// Update the comment to DB. 
		// Update the file.
		try
		{
			if(FilePicker.files.length>0){
				let statename=appsmith.store.statename==null?storeValue('statename','FileCheck'):appsmith.store.statename
				let progressstatus=appsmith.store.progressstatus==null?storeValue('progressstatus','0'):appsmith.store.progressstatus
				let retry=0;
				await FileUploadProcess.clearError();
				await storeValue('closedisable','False');
				if(appsmith.store.statename=='Completed'){
					statename="FileCheck";
					progressstatus=0;
					await storeValue('statename',statename);
					await storeValue('progressstatus',progressstatus);
				}
				//await showModal('Progress_Modal');
				let DriveId = FileUploadProcess.getValue('Estimate', 'DriveId');
				let DriveItemId = FileUploadProcess.getValue('Estimate', 'DriveItemId');
			let fileParams = { 	 
													 "FileType":FilePicker.files[0].name.split('.').pop().trim(),
					                 "SalesNumber":Estimate_Table.selectedRow.Number,
													 "ModifiedBy":appsmith.user.email.split("@")[0],
													 "SalesId":Estimate_Table.selectedRow.Id,
													 "EstimateId":Estimate_Table.selectedRow.EId,
				                   "OriginalFileName":appsmith.store.tabledata[5].Value
				};
			
			await showModal('Progress_Modal');
			while(statename != 'Completed')
				{
				console.log(progressstatus);
				console.log(statename);
				if(statename!='Error'){
						await storeValue('statename',statename);
						await storeValue('progressstatus',progressstatus);
				}
						switch(statename)
						{
								case 'FileCheck':
										let response = await SpecificFilesInDrive_Select.run({'DriveId': DriveId,
																			'DriveItemId': DriveItemId,
																			'FileName':EstimateAttachments_Table.selectedRow.FileName});
										if(response.value.length>0){
												for(const eachFile of response.value ) {
													if (eachFile.name == ActualFileName_Input.text){
														statename='UploadToSharePoint';
														progressstatus=25;
														break;
													}     
												}
										}
										if(statename!='UploadToSharePoint'){
												await FileUploadProcess.setError("File Not Found In Sharepoint!");
												statename='Error';
										}
										break;
								
								case 'DBUpdate':
										
										await EAttachments_Update.run({"FileId":FileId, "FileComments": FileComments})
										statename='UpdateMetadata';
										progressstatus=75;
								    break;

							case 'UploadToSharePoint': 
								if(FilePicker.files.length>0){
									 console.log('start2...')
										let uploadurl=await  UploadSession_Create.run({'DriveId':DriveId,'DriveItemId':DriveItemId,'fileName':appsmith.store.ActualFileName});
										console.log(uploadurl.uploadUrl);
										let filesize=FilePicker.files[0].size;
										let startindex=0; 
										let responsecreate = ""; 
										let upload_chunk = filesize; 
										let endindex=filesize-1;
										responsecreate = await FileUpload_Create.run(()=>{},()=>{},{'uploadurl':UploadSession_Create.data.uploadUrl.split('//')[1],'range':upload_chunk,'startindex':startindex,'endindex':endindex,
																																								'filesize':filesize});
										console.log('response is',FileUpload_Create.data);
										if(FileUpload_Create.data.length!=0){
												if(FileUpload_Create.data.name == ActualFileName_Input.text){
												statename='DBUpdate';
												progressstatus=50;
											}
										}
										else if(retry==0)
										{
											retry++;
											await FileUploadProcess.setError("Upload Failed in first attempt, attempting second");
										}
										else{
											await FileUploadProcess.setError("Upload Failed!, File Upload Update Response not valid");
											statename='Error';
										}
								}else{
									statename='Completed';
									progressstatus=100;
									
								}
								break;
							case 'UpdateMetadata':
										let responsemetadata="";
										
										responsemetadata = await FileUploadProcess.modifyFileMetadata(
																																									appsmith.store.ActualFileName, 
																																									fileParams,
																																									'SalesId',
																																								 Estimate_Table.selectedRow.Id);
									
										console.log(responsemetadata);
										if(responsemetadata.length!=0){
											if(responsemetadata.SalesId==Estimate_Table.selectedRow.Id){
												statename='Completed'
												progressstatus=100;
											}
										}
										else if(retry==0)
										{
												retry++;
												await FileUploadProcess.setError("First Attemp for Metadata is failed, Attempting Second");
										}
										else{
												await FileUploadProcess.setError("Upload Failed!, Metadata create response not valid");
												statename='Error';
										}
						 				break;
							
							case 'Error':
										await storeValue('closedisable','True');
										statename='Completed';
										break;						
					}
			}
			await storeValue('statename',statename)
			.then(()=>storeValue('progressstatus',progressstatus))
			if(appsmith.store.statename=='Completed'&&appsmith.store.ErrorMessage==''){
				await EAttachments_Select.run({"EId":Estimate_Table.selectedRow.Id})
			  await FileUploadProcess.runRefreshFunc()
			  .then(()=>closeModal('Progress_Modal'))
				.then(()=>storeValue('ActualFileName',''))
				.then(()=>Promise.all([showModal('FileUpload_Modal'),EAttachments_Select.run({"EId":Estimate_Table.selectedRow.EId})]))
				.then(()=>showAlert('Estimate File Updated','success'))
				.then(()=>resetWidget('QuoteAttachments_Table'))
			}
			}else{
				
				await EAttachments_Update.run({"FileId":FileId, "FileComments": FileComments})
				.then(() => EAttachments_Select.run({"EId":Estimate_Table.selectedRow.EId}))
				.then(()=>storeValue('ActualFileName',''))
				.then(()=>Promise.all([showModal('FileUpload_Modal'),EAttachments_Select.run({"EId":Estimate_Table.selectedRow.EId})]))
				.then(()=>showAlert('File Comments Updated','success'))
			}
		}
		catch(err)
			{
				if(err.message=="Cannot read properties of undefined (reading 'data')"){
							Promise.all([FileUploadProcess.setError("Network got disconnected!, Please check your connection and retry"),
													storeValue('closedisable','True'),showAlert('Network got disconnected!, Please check your connection and retry','error')])
				 	
				}else{
							Promise.all([FileUploadProcess.setError("Upload Failed retry, " + err.message),
													 storeValue('closedisable','True'),showAlert("Upload Failed retry, " 
													 +err.message,'error')])
				}
			}
	},
	runDeleteFile: async (FileId) => {
		// Delete entry in db. 
		// Delete entry in sharepoint
	 try{
		 		let fileObject="";
		 		await FileUploadProcess.clearError();
		 		
				fileObject = await FileUploadProcess.getFileObject(appsmith.store.ActualFileName,Estimate_Table.selectedRow.Id,
																													 'SalesId');
				if (appsmith.store.ErrorOccured === true) {
					await showAlert("File not found in sharepoint, Deleting in database");
					await FileUploadProcess.setError("No files exist!");
				}else{
				console.log(fileObject);
				let driveId = FileUploadProcess.getValue('Estimate', 'DriveId');
				let itemId = fileObject.driveItem["id"]; // sharepointid for file , then delete it

				let response = "";
				response = await File_Delete.run({"driveId": driveId, "itemId": itemId})
				}		

				await EAttachments_Delete.run({"FileId": FileId})
				.then(() => EAttachments_Select.run({"EId":Estimate_Table.selectedRow.EId}))
		    .then(()=>storeValue('ActualFileName',''))
				.then(() => showAlert("Estimate File Deleted", "success"))
		 		.then(()=>FileUpload_Check.run({"EId":Estimate_Table.selectedRow.EId}))
									
	 }catch(err){
		 if(err.message=="Cannot read properties of undefined (reading 'data')"){
							Promise.all([FileUploadProcess.setError("Network got disconnected!, Please check your connection and retry"),
													storeValue('closedisable','True'),showAlert('Network got disconnected!, Please check your connection and retry','error')])
				 	
				}else{
							Promise.all([FileUploadProcess.setError("Delete Failed retry, " + err.message),
													 storeValue('closedisable','True'),showAlert("Delete Failed retry, " 
													 +err.message,'error')])
				} 
	 }
	},
	runRefreshFunc: async () => {
		Promise.all([GlobalVariables.resetForm(['UserText_Input','FileComments_Input','FilePicker']),
			storeValue('ActualFileName', ""),storeValue('disable',false),FileUploadProcess.clearError()])
	},
	testRunRefreshFunc: async () => {
		Promise.all([resetWidget("FilePicker"),
			storeValue('ActualFileName', ""),storeValue('disable',false),FileUploadProcess.clearError()])
	},
	
	modifyMetadata: async (fileParams, Number, NumberName) => {
		// Get a file name and the type of document (component, assembly or manufacturing)
		// Steps:
		// Get File Id from the sharepoint list.
		// Send the metadata with the API call. 
		//console.log("meta check1")
		let response="";
		let metaresponse="";
		let siteId="";
		let listId ="";
		Promise.all([siteId=FileUploadProcess.getValue('Estimate','SharepointId'),listId=FileUploadProcess.getValue('Estimate','ListId')])
		
		let params = {'siteId': siteId, 
									'listId': listId,
								  'Number': Number,
								  'NumberName':NumberName};
		
		response = await ListItemsDelete_Select.run(params);
		
		if (response.value.length == 0) {
			await showAlert('Update failed','error');
		}
		let data=[];
		for(const eachFile of response.value ) {
		
				let query_params = {
					'siteId': FileUploadProcess.getValue('Estimate', 'SharepointId'), 
					'listId': FileUploadProcess.getValue('Estimate', 'ListId'),
					'listItemId': eachFile.id,
					'fileParams': fileParams,
				};
				data.push(query_params);
		
		}
		const metadata = data.map(data=>FileMetadata_Create.run(data))
		return Promise.all(metadata)
	},
	
}
	