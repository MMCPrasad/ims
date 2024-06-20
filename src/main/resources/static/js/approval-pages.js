
function initiatePage2(target, pageName, tableData, formData) {

    this.dataTable = null;
    const selector = 'input:not([ignore]):not(.dataArrayObjectElement,.dataObjectElement)[type!=search],select:not(.dataArrayObjectElement,.dataObjectElement):not([ignore]),textarea:not(.dataArrayObjectElement,.dataObjectElement):not([ignore]),.dataArray:not([parent]),.dataObject';

    this.setupDatatable = function () {

        for (var i = 0; i < tableData.columns.length; i++) {
            $(target).find('#mainTable thead').find('tr').first().append('<th>' + tableData.columns[i].name + '</th>');
            delete tableData.columns[i].name;
        }
        $(target).find('#mainTable thead').find('tr').first().append('<th style="width:1px;">Action</th>');

        this.dataTable = $(target).find('#mainTable').DataTable({
            "aLengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
            "pageLength": tableData.pageLength || 10,
            "ordering": true,
            "autoWidth": false,
            "processing": true,
            "serverSide": true,
            "order": [[0, "desc"]],
            "searchHighlight": true,
            "searchDelay": 350,
            "ajax": {
                "url": tableData.url,
                "contentType": "application/json",
                "type": "POST",
                "data": function (d) {
                    return JSON.stringify(d);
                },
                error: function (xhr, error, code) {
                    console.log(xhr);
                    console.log(code);
                }
            },
            "columns": tableData.columns,
            "createdRow": tableData.createdRow || function (row, data) {
                let action_td = document.createElement('td');
                $(action_td).addClass('text-center');
                if (data['status'] === 'inactive') {
                    $(action_td).append('<a href="javascript:void(0)" class="reactrec" data-toggle="tooltip" data-placement="top" title="Reactivate Record"><i class="fas fa-check h6 text-success"></i></a>');
                } else {
                    $(action_td).append('<a href="javascript:void(0)" class="editrec me-1" data-toggle="tooltip" data-placement="top" title="Edit Record"><i class="fa fa-eye h6 text-info" style="color: #000000;"></i></a>');
                }
                $(row).append(action_td);
                if (pageName === "Fixed Asset Requests" || pageName === "Fixed Asset Requests Admin" || pageName === "Budget Availablity" || pageName === "Budget Line Approval" || pageName === "Fixed Asset Request Quotation Approval") {
                    setTableStatus($(row).find('td').eq(tableData.columns.length - 3));
                } else {
                    setTableStatus($(row).find('td').eq(tableData.columns.length - 2));
                }
                $(row).data('id', data['id']);
                $(row).data('tId', data['tId']);
                $(row).data('action', data['action']);
                //$(row).find('[data-toggle="tooltip"]').tooltip();
            }
        });
    };


    this.setupFields = function () {
        let fields = formData.fields;
        if (!fields) {
            $(formData.customFields).appendTo($(target).find('#fields'));
        } else {
            for (var i = 0; i < fields.length; i++) {
                let div = document.createElement('div');
                $(div).addClass('mb-3 col-' + fields[i].col);
                if (fields[i].hidden) {
                    $(div).attr('style', 'display:none;');
                }
                let mandatory = '';
                if (fields[i].mandatory) {
                    mandatory = ' <span class="text-danger">*</span>';
                }
                $(div).append('<label class="col-form-label">' + fields[i].name + mandatory + '</label>');

                if (fields[i].type === 'text') {
                    let el = document.createElement('input');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    $(el).attr('type', 'text');
                    $(el).attr('autocomplete', 'off');
                    $(el).addClass('form-control');
                    $(el).attr('id', fields[i].id);
                    $(div).append(el);
                } else if (fields[i].type === 'date') {
                    let el = document.createElement('input');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    $(el).attr('type', 'date');
                    $(el).attr('autocomplete', 'off');
                    $(el).addClass('form-control');
                    $(el).attr('id', fields[i].id);
                    $(div).append(el);
                } else if (fields[i].type === 'texta') {
                    let el = document.createElement('textarea');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    $(el).attr('autocomplete', 'off');
                    $(el).addClass('form-control');
                    $(el).attr('id', fields[i].id);
                    $(div).append(el);
                } else if (fields[i].type === 'select') {
                    let el = document.createElement('select');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    if (fields[i].ajax) {
                        $(el).attr('ajax', fields[i].ajax);
                    }
                    if (fields[i].refId) {
                        $(el).attr('refId', fields[i].refId);
                        $(el).attr('reftxt', fields[i].refTxt);
                    }
                    $(el).addClass('form-select selectpicker');
                    $(el).attr('id', fields[i].id);
                    $(div).append(el);
                    var sel = convertToSelect2(el);
                    if (fields[i].change) {
                        $(el).change(fields[i].change);
                    }
                    if (fields[i].data) {
                        sel.select2({data: fields[i].data});
                    }
                } else if (fields[i].type === 'int') {
                    let el = document.createElement('input');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    $(el).attr('type', 'text');
                    $(el).attr('autocomplete', 'off');
                    $(el).addClass('form-control autoint');
                    $(el).attr('id', fields[i].id);
                    $(el).autoNumeric({mDec: '0'});
                    $(div).append(el);
                } else if (fields[i].type === 'double') {
                    let el = document.createElement('input');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    $(el).attr('type', 'text');
                    $(el).attr('autocomplete', 'off');
                    $(el).addClass('form-control autodouble');
                    $(el).attr('id', fields[i].id);
                    $(el).autoNumeric();
                    $(div).append(el);
                } else if (fields[i].type === 'file') {
                    let el = document.createElement('input');
                    if (fields[i].mandatory) {
                        $(el).attr('required', true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr('doe', true);
                    }
                    $(el).attr('type', 'file');
                    $(el).attr('autocomplete', 'off');
                    $(el).addClass('form-control');
                    $(el).attr('id', fields[i].id);
                    $(div).append(el);
                }
                $(target).find('#fields').append(div);
            }
        }
    };

    this.saveRecord = function (data) {

        let headers = {};
        if (formData.contentType === 'json') {
            data = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        } else {
            let fd = new FormData();
            Object.keys(data).forEach(key => {
                fd.append(key, data[key]);
            });
            data = fd;
        }

        console.log(data);

        Swal.fire({
            title: 'Are you sure?',
            text: "This record will be saved !",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4bbf73',
            cancelButtonColor: '#495057',
            confirmButtonText: 'Yes, Continue!',
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                return fetch(formData.url, {
                    method: 'POST',
                    body: data,
                    headers: headers
                }).then(response => {
                    //session timeout
                    if (response.status === 302) {
                        throw new Error("session Timed out !, Please login to continue !");
                    }
                    //unexpected Error
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }).catch(error => {
                    Swal.showValidationMessage('Request failed:' + error);
                });
            },
            allowOutsideClick: () => !Swal.isLoading()

        }).then((result) => {
            if (result.value) {
                if (result.value.status !== 'success') {
                    Swal.fire('Error!', result.value.message, 'error');
                } else {
                    Swal.fire('Successfull!', result.value.message, 'success');
                    this.dataTable.ajax.reload();
                    showTable();
                }
            }
        });
    };

    this.updateRecord = function (data) {

        let headers = {};
        if (formData.contentType === 'json') {
            data = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
        } else {
            let fd = new FormData();
            Object.keys(data).forEach(key => {
                //console.log(data[key]);
                if (Array.isArray(data[key]) | (typeof data[key] === 'object' && !(data[key] instanceof File | data[key] instanceof Blob) && data[key] !== null)) {
                    fd.append(key, JSON.stringify(data[key]));
                } else {
                    fd.append(key, data[key]);
                }

            });
            data = fd;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: "This record will be Updated !",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4bbf73',
            cancelButtonColor: '#495057',
            confirmButtonText: 'Yes, Continue!',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return fetch(formData.url, {
                    method: 'PUT',
                    body: data,
                    headers: headers
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }).catch(error => {
                    Swal.showValidationMessage('Request failed:' + error);
                });
            },
            allowOutsideClick: () => !Swal.isLoading()

        }).then((result) => {
            if (result.value) {
                if (result.value.status !== 'success') {
                    Swal.fire('Error!', result.value.message, 'error');
                } else {
                    Swal.fire('Successfull!', result.value.message, 'success');
                    this.dataTable.ajax.reload();
                    showTable();
                }
            }
        });
    };

    this.clearForm = function () {
        $(target).find('#formSection').find(selector).each(function () {
            clearField(this);
        });
    };

    this.setupCommonOperations = function () {
        let obj = this;
        $(target).find('#addBtn').click(function () {
            $('#saveBtn').data('mode', 'save');
            $('#rejectBtn').data('mode', 'save');
            $('#saveBtn').html('<i class="feather icon-save"></i> Save');
            obj.clearForm();
            showForm();
        });
        $(target).find('#cancelBtn').click(function () {
//            if (pageName === "Fixed Asset Requests Admin") {
//                $('#saveBtnApproval').show();
//            }
            $('#multiasset').empty();
            location.reload();
            showTable();
        });

        $(target).find('#mainTable').on('click', '.reactrec', function () {
            let id = $(this).parents('tr').first().data('id');
            Swal.fire({
                title: 'Are you sure?',
                text: "This record will be re-activated !",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#4bbf73',
                cancelButtonColor: '#495057',
                confirmButtonText: 'Yes, Continue!',
                showLoaderOnConfirm: true,
                preConfirm: async () => {
                    return fetch(formData.url + '/' + id, {
                        method: 'PATCH'
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    }).catch(error => {
                        Swal.showValidationMessage('Request failed:' + error);
                    });
                },
                allowOutsideClick: () => !Swal.isLoading()

            }).then((result) => {
                if (result.value) {
                    if (result.value.status !== 'success') {
                        Swal.fire('Error!', result.value.message, 'error');
                    } else {
                        Swal.fire('Successfull!', result.value.message, 'success');
                        obj.dataTable.ajax.reload();
                    }
                }
            });
        });


        $(target).find('#mainTable').on('click', '.delrec', function () {
            let id = $(this).parents('tr').first().data('id');
            Swal.fire({
                title: 'Are you sure?',
                text: "This record will be deactivated !",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#4bbf73',
                cancelButtonColor: '#495057',
                confirmButtonText: 'Yes, Continue!',
                showLoaderOnConfirm: true,
                preConfirm: () => {
                    return fetch(formData.url + '/' + id, {
                        method: 'DELETE'
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    }).catch(error => {
                        Swal.showValidationMessage('Request failed:' + error);
                    });
                },
                allowOutsideClick: () => !Swal.isLoading()

            }).then((result) => {
                if (result.value) {
                    if (result.value.status !== 'success') {
                        Swal.fire('Error!', result.value.message, 'error');
                    } else {
                        Swal.fire('Successfull!', result.value.message, 'success');
                        obj.dataTable.ajax.reload();
                    }
                }
            });
        });



        let request_table_id;
        let tId;
        let approval_status;
        $(target).find('#mainTable').on('click', '.editrec', function () {

            if (pageName === "Fixed Asset Requests Admin") {
                approval_status = $(this).parents('tr').first().data('action');
                if (approval_status === "initial_approved") {
                    showQuataion();
                } else {
                    $('#admin_fields').show();
                    $('#quatation_fields').hide();
                }
            }

            addLoader('#tableSection');
            let id = $(this).parents('tr').first().data('id');
            request_table_id = id;

            tId = $(this).parents('tr').first().data('tId');

            fetch(formData.url + '/' + id)
                    .then(resp => resp.json())
                    .then(resp => {
                        obj.clearForm();
                        if (pageName === 'Supplier Registration') {
                            $(target).find('#formSection').find(selector).each(function () {
                                let data = resp.data[$(this).attr('id')];
                                if (!data) {
                                    return;
                                }

                                setFieldData(this, data);
                            });
                            if (formData.afterFieldSet) {
                                formData.afterFieldSet(resp.data);
                            }
                        } else {
                            let asset_rowCount = JSON.stringify(resp.data.multiAsset);
                            $('#requestId').text(resp.data.requestId);
                            $('#recommended').text(resp.data.recommendTo.text);
                            $('#requestBy').text(resp.data.requestBy.text);
                            $('#department').text(resp.data.department.text);
                            $('#asset').text(resp.data.asset.text);
                            $('#quantity').text(resp.data.quantity);




                            if (pageName === "Fixed Asset Requests") {
                                //$('#budgetLine').val(resp.data.budgetLine.id);
                                if (resp.data.budgetAvailability === "Yes") {
                                    $('#budgetLine').empty().append('<option value="' + resp.data.budgetLine.id + '">' + resp.data.budgetLine.text + '</option>').val(resp.data.budgetLine.id).trigger('change');
                                    $('#budgetAvailability').val(resp.data.budgetAvailability).trigger('change');
                                } else {
                                    var budgetLine_edit = document.getElementById("budgetLine");
                                    budgetLine_edit.disabled = true;
                                    $('#budgetAvailability').val(resp.data.budgetAvailability).trigger('change');
                                }

                                //$('#budgetLine').text(resp.data.budgetLine.text);
//                                 $('#budgetAvailability').val(resp.data.budgetAvailability);
                            } else {
                                $('#budgetLine').text(resp.data.budgetLine.text);
                                $('#budgetAvailability').text(resp.data.budgetAvailability);
                            }





                            $('#justification').text(resp.data.justification);

                            // Split the date string at the "T" character and take the first part
                            const dateParts = resp.data.entOn.split("T");
                            const dateOnly = dateParts[0];
                            $('#entOn').text(dateOnly);

//                            // Loop through each entry in multiAsset
//                            resp.data.multiAsset.forEach(asset => {
//                                // Create a new row element
//                                let temp = document.createElement('tr');
//
//                                // Populate the row with data
//                                $(temp).html('<td style="padding-left:0">' + asset.subCategory.text + '</td>'
//                                        + '<td style="width:25%; text-align: right;" class="qty">' + asset.quantity + '</td>');
//
//                                // Append the row to the table
//                                $('#multiasset').append(temp);
//                            });

                            let isFirstRecordProcessed = false; // Flag to track if the first record has been processed

                            let qout_audit = document.createElement('div');

                            resp.data.audits.forEach((audits, index) => {
                                // Create a new row element
                                let temp = document.createElement('div');

//                            let action ='<div class="row padding_bottom_5"><div class="col-md-2"><label for="Comment">Action</label></div><div class="col-md-4"><label">' + audits.action + '</label></div></div>';


                                let comment = '';
                                if (audits.action == "quotuion_approval_pending") {
                                    if (index >= 1) {
                                        if (audits.comment !== null && audits.comment !== "") {
                                            comment = '<div class="row"><div class="col-md-2"><label for="Comment">Justification</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + audits.comment + '</label></div></div>';
                                        } else {
                                            comment = '<div class="row"><div class="col-md-2"><label for="Comment">Justification</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">No Comment</label></div></div>';
                                        }
                                    }
                                } else {
                                    if (index >= 1) {
                                        if (audits.comment !== null && audits.comment !== "") {
                                            comment = '<div class="row"><div class="col-md-2"><label for="Comment">Comment</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + audits.comment + '</label></div></div>';
                                        } else {
                                            comment = '<div class="row"><div class="col-md-2"><label for="Comment">Comment</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">No Comment</label></div></div>';
                                        }
                                    }
                                }

                                let recommend = '';
                                if (audits.forwardTo.id !== null && (audits.action !== 'requested' && audits.action !== 'request_forwarded_admin_stage')) {
                                    recommend = '<div class="row"><div class="col-md-2" ><label for="recommendTo">Recommend To</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + audits.forwardTo.text + '</label></div></div>';
                                }

                                let dateParts_audit = audits.modOn.split("T");
                                let dateOnly_audits = dateParts_audit[0];

                                let audit_entOn = '';
                                if (index >= 1) {
                                    audit_entOn = '<div class="row"><div class="col-md-2" ><label for="modOn">Action On</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + dateOnly_audits + '</label></div></div>';
                                }


                                let actionLable = '';
                                if (audits.action === 'approved') {
                                    actionLable = '<small class="badge fs--1  badge-soft-success">Approved</small>';
                                } else if (audits.action === 'rejected') {
                                    actionLable = '<small class="badge fs--1  badge-soft-danger">Rejected</small>';
                                } else if (audits.action === 'pending') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Pending</small>';
                                } else if (audits.action === 'recommended') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Recommended</small>';
                                } else if (audits.action === 'forwarded') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Recommended</small>';
                                } else if (audits.action === 'admin_pending') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Recommended</small>';
                                } else if (audits.action === 'approval_pending') {
                                    actionLable = '<small class="badge fs--1  badge-soft-success">Approved</small>';
                                } else if (audits.action === 'admin_approved' || audits.action === 'budget_checked') {
                                    actionLable = '<small class="badge fs--1  badge-soft-success">Admin Approved</small>';
                                } else if (audits.action === 'admin_recommended') {
                                    actionLable = '<small class="badge fs--1  badge-soft-success">Approved</small>';
                                } else if (audits.action === 'requested' || audits.action === 'request_forwarded_admin_stage') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Requested</small>';
                                } else if (audits.action === 'forwarded_admin_stage') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Recommended</small>';
                                } else if (audits.action === 'budget_pending') {
                                    actionLable = '<small class="badge fs--1  badge-soft-warning">Budget Line Selected</small>';
                                } else if (audits.action === 'budget_approved' || audits.action === 'quotation_added' || audits.action === 'initial_approved') {
                                    actionLable = '<small class="badge fs--1  badge-soft-success">Budget Approved</small>';
                                } else if (audits.action === 'quotuion_approval_pending') {
                                    actionLable = '<small class="badge fs--1  badge-soft-primary">Quotation Added</small>';
                                }

                                let budgetLine = '';
                                if (audits.budgetLine.id !== null) {
                                    budgetLine = '<div class="row"><div class="col-md-2" ><label for="recommendTo">Budget Line</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + audits.budgetLine.text + '</label></div></div>';
                                }

                                let action = '';
                                action = '<div class="row"><div class="col-md-2"><label for="action">Action</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + actionLable + '</label></div></div>';

                                let actionBy = ''; // Initialize actionBy variable
                                if (index >= 1) {
                                    actionBy = '<div class="row"><div class="col-md-2" ><label for="modOn">Action By</label></div><div class="col-md-4"><label class="mb-0 fw-semi-bold">' + audits.actionBy.text + '</label></div></div>';
                                }




                                if (audits.action !== "quotuion_approval_pending") {
                                    // Populate the row with data
                                    $(temp).html(action + budgetLine + actionBy + recommend + audit_entOn + comment + '<hr/>');
                                    // Append the row to the table
                                    $('#approvals').append(temp);
                                } else {
                                    // Populate the row with data
                                    $(qout_audit).html(action + budgetLine + actionBy + recommend + audit_entOn + comment + '<hr/>');
                                }
                            });

                            if (pageName === "Fixed Asset Request Quotation Approval") {
                                resp.data.quotation_data.forEach((quotation_data, index) => {
                                    let quot = '';

                                    let quot_supplier = '<td>' + quotation_data.supplier.text + '</td>';
                                    let quot_item_name = '<td>' + quotation_data.itemName + '</td>';
                                    let quot_description = '<td>' + quotation_data.description + '</td>';
                                    let quot_unit_price = '<td class="text-end">' + quotation_data.unitPrice.toFixed(2) + '</td>';
                                    let quot_units = '<td class="text-end"> ' + quotation_data.units + '</td>';
                                    let quot_tax = '<td class="text-end">' + quotation_data.tax.toFixed(2) + '</td>';
                                    let quot_total = '<td class="text-end">' + quotation_data.total.toFixed(2) + '</td>';
                                    let quot_document = '<td style="text-align:center;"><a href="fareqs/' + quotation_data.document + '" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">\n\
                                                         <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>\n\
                                                         <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>\n\
                                                         </svg></a></td>';

                                    quot = '<tr>' + quot_supplier + quot_item_name + quot_description + quot_unit_price + quot_units + quot_tax + quot_total + quot_document + '</tr>';
                                    $('#qout_fields').append(quot);
                                });
                                


                                let rec_qout = '';
                                let rec_supplier = '<td>' + resp.data.recSuplier.supplier.text + '</td>';
                                let rec_item_name = '<td>' + resp.data.recSuplier.itemName + '</td>';
                                let rec_description = '<td>' + resp.data.recSuplier.description + '</td>';
                                let rec_unit_price = '<td class="text-end">' + resp.data.recSuplier.unitPrice.toFixed(2) + '</td>';
                                let rec_units = '<td class="text-end"> ' + resp.data.recSuplier.units + '</td>';
                                let rec_tax = '<td class="text-end">' + resp.data.recSuplier.tax.toFixed(2) + '</td>';
                                let rec_total = '<td class="text-end">' + resp.data.recSuplier.total.toFixed(2) + '</td>';
                                let rec_document = '<td style="text-align:center;"><a href="fareqs/' + resp.data.recSuplier.document + '" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">\n\
                                                         <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>\n\
                                                         <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>\n\
                                                         </svg></a></td>';

                                rec_qout = '<tr>' + rec_supplier + rec_item_name + rec_description + rec_unit_price + rec_units + rec_tax + rec_total +rec_document+ '</tr>';
                                $('#rec_qout_field').append(rec_qout);


                                $('#qout_audit').append(qout_audit);

                            }

                        }

                        removeLoader('#tableSection');
                        showForm();
                        $('#saveBtn').data('mode', 'update');
                        if (pageName === 'Supplier Registration') {
                            $('#saveBtn').html('<i class="feather icon-save"></i> Update');
                        } else {
                            $('#saveBtn').html('<i class="feather icon-save"></i> Approve');
                        }
                        $('#saveBtn').data('id', id);
                    });



        });

        $(target).find('#saveBtn').click(function () {
            let data = {};
            let deletedFiles = [];
            let valid = true;

            $('#formSection').find(selector).each(function () {
                let fieldName = $(this).parent().find('label').html();
                let fieldId = $(this).attr('id');

                try {
                    if ($(this).hasClass('dataArray')) {
                        data[fieldId] = getDataArrayData(this, data, deletedFiles);
                    } else if ($(this).hasClass('dataObject')) {
                        data[fieldId] = JSON.stringify(getDataObjectData(this, data, deletedFiles));
                    } else {
                        let fd = getFieldData(this);
                        if (fd.value !== null) {
                            data[fieldId] = fd.value;
                        }
                        if (fd.deleted !== 'undefined' && fd.deleted === true) {
                            deletedFiles.push(fieldId);
                        }
                    }

                } catch (e) {
                    console.error(e);
                    Swal.fire(e.message, fieldName, 'warning');
                    valid = false;
                    return false;
                }


            });

            if (!valid) {
                return;
            }

            if (formData.beforeSaveOrUpdate) {
                formData.beforeSaveOrUpdate(data);
            }

            if ($('#saveBtn').data('mode') === 'update') {
                data['id'] = $('#saveBtn').data('id');
                if (deletedFiles.length > 0) {
                    data['deleted'] = JSON.stringify(deletedFiles);
                }
                obj.updateRecord(data);
            } else {
                obj.saveRecord(data);
            }
        });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // function for approve reject recommend button
        function handleActionBtnClick() {

            let data = {};
            let formData = new FormData(); // Create a FormData object

            if (approval_status === "initial_approved") {
                let quotationsArray = []; // Clear the array


                let countRow = $('.qout_fields table tbody tr').length;

                let recommendedQout = -1;

                for (let i = 0; i < countRow; i++) {
                    let qout_fields = {};
                    let row = $('.qout_fields table tbody tr').eq(i);

                    let supplier = {
                        id: row.find('.ajax-select').val()
//                        text: row.find('.ajax-select').text()
                    };
                    qout_fields.supplier = supplier;
                    qout_fields.itemName = row.find('.item_name').val();
                    qout_fields.description = row.find('.description').val();
                    qout_fields.unitPrice = row.find('.unit_price').val();
                    qout_fields.units = row.find('.units').val();
                    qout_fields.tax = row.find('.tax').val();

                    // Get the document file
                    let documentFile = row.find('.document').prop('files')[0];
                    console.log(documentFile);

                    if (documentFile) {
                        formData.append(`document[${i}].documentFile`, documentFile);
                    }

                    quotationsArray.push(qout_fields);

                    // Check if this row's radio button is selected
                    if (row.find('input[name="recommended_quotation"]').is(':checked')) {
                        recommendedQout = i; // Row number (0-based index)
                    }
                }
                
                // Append other form data
                formData.append('quotations', JSON.stringify(quotationsArray));
                formData.append('faId', request_table_id);
                formData.append('fa_audit_id', tId);
                formData.append('recommendTo', $('#recommendTo').val());
                formData.append('comment', $('#comment').val());
                formData.append('recommendedQout', recommendedQout);

            }





            let jsonData = JSON.stringify(data);

            let headers = {
                'Content-Type': 'application/multipart'
            };

            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            console.log(formData);



            if (pageName === 'Fixed Asset Requests') {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This record will be saved!",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4bbf73',
                    cancelButtonColor: '#495057',
                    confirmButtonText: 'Yes, Continue!',
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        return fetch("fixed-asset-request/approval", {
                            method: 'POST',
                            body: new URLSearchParams({
                                tId: tId,
                                faId: request_table_id,
                                action: $('#action').val(),
                                comment: $('#comment').val(),
                                budgetAvailability: $('#budgetAvailability').val(),
                                budgetLine: $('#budgetLine').val() || null
//                                forwardTo: $('#recommendTo').val()
                            })
                        }).then(response => {
                            if (response.status === 302) {
                                throw new Error("Session timed out! Please login to continue!");
                            }
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.json();
                        }).catch(error => {
                            Swal.showValidationMessage('Request failed: ' + error);
                        });
                    },
                    allowOutsideClick: () => !Swal.isLoading()

                }).then((result) => {
                    if (result.value.status === 'success') {
                        Swal.fire('Successful!', result.message, 'success').then(() => {
                            $('#multiasset').empty();
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error!', updatedResult.message, 'error');
                    }
                });
            }
            ;

            if (pageName === 'Fixed Asset Requests Admin') {
                console.log('here');
                if (approval_status === "initial_approved") {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "This record will be saved!",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#4bbf73',
                        cancelButtonColor: '#495057',
                        confirmButtonText: 'Yes, Continue!',
                        showLoaderOnConfirm: true,
                        preConfirm: async () => {
                            return fetch("fixed-asset-request-quotation/save", {
                                method: 'POST',
                                body: formData
                            }).then(response => {
                                if (response.status === 302) {
                                    throw new Error("Session timed out! Please login to continue!");
                                }
                                if (!response.ok) {
                                    throw new Error(response.statusText);
                                }
                                return response.json();
                            }).catch(error => {
                                Swal.showValidationMessage('Request failed: ' + error);
                            });
                        },
                        allowOutsideClick: () => !Swal.isLoading()

                    }).then((result) => {
                        if (result.value.status === 'success') {
                            Swal.fire('Successful!', result.message, 'success').then(() => {
                                $('#multiasset').empty();
                                location.reload();
                            });
                        } else {
                            Swal.fire('Error!', updatedResult.message, 'error');
                        }
                    });
                } else {
                    if ($('#recommendTo').val() !== null) {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "This record will be saved!",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#4bbf73',
                            cancelButtonColor: '#495057',
                            confirmButtonText: 'Yes, Continue!',
                            showLoaderOnConfirm: true,
                            preConfirm: async () => {
                                return fetch("fixed-asset-request/admin", {
                                    method: 'POST',
                                    body: new URLSearchParams({
                                        tId: tId,
                                        faId: request_table_id,
                                        action: $('#action').val(),
                                        comment: $('#comment').val(),
                                        forwardTo: $('#recommendTo').val()
                                    })
                                }).then(response => {
                                    if (response.status === 302) {
                                        throw new Error("Session timed out! Please login to continue!");
                                    }
                                    if (!response.ok) {
                                        throw new Error(response.statusText);
                                    }
                                    return response.json();
                                }).catch(error => {
                                    Swal.showValidationMessage('Request failed: ' + error);
                                });
                            },
                            allowOutsideClick: () => !Swal.isLoading()

                        }).then((result) => {
                            if (result.value.status === 'success') {
                                Swal.fire('Successful!', result.message, 'success').then(() => {
                                    $('#multiasset').empty();
                                    location.reload();
                                });
                            } else {
                                Swal.fire('Error!', updatedResult.message, 'error');
                            }
                        });
                    } else {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: "This record will be saved!",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#4bbf73',
                            cancelButtonColor: '#495057',
                            confirmButtonText: 'Yes, Continue!',
                            showLoaderOnConfirm: true,
                            preConfirm: async () => {
                                return fetch("fixed-asset-request/admin", {
                                    method: 'POST',
                                    body: new URLSearchParams({
                                        tId: tId,
                                        faId: request_table_id,
                                        action: $('#action').val(),
                                        comment: $('#comment').val()
                                    })
                                }).then(response => {
                                    if (response.status === 302) {
                                        throw new Error("Session timed out! Please login to continue!");
                                    }
                                    if (!response.ok) {
                                        throw new Error(response.statusText);
                                    }
                                    return response.json();
                                }).catch(error => {
                                    Swal.showValidationMessage('Request failed: ' + error);
                                });
                            },
                            allowOutsideClick: () => !Swal.isLoading()

                        }).then((result) => {
                            if (result.value.status === 'success') {
                                Swal.fire('Successful!', result.message, 'success').then(() => {
                                    $('#multiasset').empty();
                                    location.reload();
                                });
                            } else {
                                Swal.fire('Error!', updatedResult.message, 'error');
                            }
                        });
                    }
                }



            }
            ;

            if (pageName === 'Budget Availablity') {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This record will be saved!",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4bbf73',
                    cancelButtonColor: '#495057',
                    confirmButtonText: 'Yes, Continue!',
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        return fetch("budget-line/budget", {
                            method: 'POST',
                            body: new URLSearchParams({
                                tId: tId,
                                faId: request_table_id,
                                budget: $('#budget').val(),
                                budget_line: $("#budget_line").val(),
                                comment: $("#comment").val()
                            })
                        }).then(response => {
                            if (response.status === 302) {
                                throw new Error("Session timed out! Please login to continue!");
                            }
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.json();
                        }).catch(error => {
                            Swal.showValidationMessage('Request failed: ' + error);
                        });
                    },
                    allowOutsideClick: () => !Swal.isLoading()

                }).then((result) => {
                    if (result.value.status === 'success') {
                        Swal.fire('Successful!', result.message, 'success').then(() => {
                            $('#multiasset').empty();
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error!', updatedResult.message, 'error');
                    }
                });
            }
            ;

            if (pageName === 'Budget Line Approval') {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This record will be saved!",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4bbf73',
                    cancelButtonColor: '#495057',
                    confirmButtonText: 'Yes, Continue!',
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        return fetch("budget-line/budget_approval", {
                            method: 'POST',
                            body: new URLSearchParams({
                                tId: tId,
                                faId: request_table_id,
                                action: $('#action').val(),
                                comment: $("#comment").val()
                            })
                        }).then(response => {
                            if (response.status === 302) {
                                throw new Error("Session timed out! Please login to continue!");
                            }
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.json();
                        }).catch(error => {
                            Swal.showValidationMessage('Request failed: ' + error);
                        });
                    },
                    allowOutsideClick: () => !Swal.isLoading()

                }).then((result) => {
                    if (result.value.status === 'success') {
                        Swal.fire('Successful!', result.message, 'success').then(() => {
                            $('#multiasset').empty();
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error!', updatedResult.message, 'error');
                    }
                });
            }
            ;

            if (pageName === 'Fixed Asset Request Quotation Approval') {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This record will be saved!",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonColor: '#4bbf73',
                    cancelButtonColor: '#495057',
                    confirmButtonText: 'Yes, Continue!',
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        return fetch("fixed-asset-request-quotation/approval", {
                            method: 'POST',
                            body: new URLSearchParams({
                                id: request_table_id,
                                tId: tId,
                                action: $('#action').val(),
                                comment: $("#comment").val()
                            })
                        }).then(response => {
                            if (response.status === 302) {
                                throw new Error("Session timed out! Please login to continue!");
                            }
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.json();
                        }).catch(error => {
                            Swal.showValidationMessage('Request failed: ' + error);
                        });
                    },
                    allowOutsideClick: () => !Swal.isLoading()

                }).then((result) => {
                    if (result.value.status === 'success') {
                        Swal.fire('Successful!', result.message, 'success').then(() => {
                            $('#multiasset').empty();
                            location.reload();
                        });
                    } else {
                        Swal.fire('Error!', updatedResult.message, 'error');
                    }
                });
            }
            ;


        }
        ;

        $('#saveBtnApproval').click(function () {
            ///////// VALIDATIONS //////////////////////////////
            let requiredFields = document.querySelectorAll('[required]');
            for (let i = 0; i < requiredFields.length; i++) {
                // Check if the field is visible before validating
                if (requiredFields[i].offsetParent !== null && requiredFields[i].value.trim() === '') {
                    showError(`Please enter ${getFieldName(requiredFields[i])}.`);
                    return; // Prevent form submission if any required field is empty
                }
            }

            // If all required fields are filled or hidden, proceed with form submission
            console.log('Form submitted successfully.');

            function showError(message) {
                Swal.fire({
                    icon: 'error',
                    title: 'Validation Error',
                    text: message
                });
            }

            function getFieldName(field) {
                // Convert field ID to human-readable format (e.g., "requestId" to "Request Id")
                return field.getAttribute('id').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
            }

            handleActionBtnClick();
        });

        $('#rejectBtn').click(function () {
            handleActionBtnClick('reject');
        });

        $('#recoBtn').click(function () {
            handleActionBtnClick('recommend');
        });

    };

    this.initialize = function () {
        let obj = this;

        if (pageName === "Supplier Registration") {
            $(target).load(window.location.origin + contextPath + 'templates/supplier-page.html', null, function (data, status, jqXGR) {
                if (formData.formSize) {
                    $(target).find('#formSection').removeClass().addClass(formData.formSize);
                }
                if (tableData.tableSize) {
                    $(target).find('#tableSection').removeClass().addClass(tableData.tableSize);
                }
                if (typeof tableData.showBorders !== 'undefined' && tableData.showBorders === false) {
                    $(target).find('#mainTable').removeClass('table-bordered');
                }
                if (typeof tableData.hover !== 'undefined' && tableData.hover === true) {
                    $(target).find('#mainTable').addClass('table-hover');
                }
                $(target).find('#tableSection .card-title').text('Search ' + pageName);
                $(target).find('#formSection .card-title').text(pageName);
                obj.setupCommonOperations();
                obj.setupDatatable();
                obj.setupFields();
            });
        } else {
            $(target).load(window.location.origin + contextPath + 'templates/approval_page.html', null, function (data, status, jqXGR) {
                if (formData.formSize) {
                    $(target).find('#formSection').removeClass().addClass(formData.formSize);
                }
                if (tableData.tableSize) {
                    $(target).find('#tableSection').removeClass().addClass(tableData.tableSize);
                }
                if (typeof tableData.showBorders !== 'undefined' && tableData.showBorders === false) {
                    $(target).find('#mainTable').removeClass('table-bordered');
                }
                if (typeof tableData.hover !== 'undefined' && tableData.hover === true) {
                    $(target).find('#mainTable').addClass('table-hover');
                }
                $(target).find('#tableSection .card-title').text(pageName);

                if (pageName === "Budget Availablity") {
                    $(target).find('#formSection .card-title').text(pageName);
                } else {
                    $(target).find('#formSection .card-title').text(pageName + ' Aproval');
                }

                obj.setupCommonOperations();
                obj.setupDatatable();
                obj.setupFields();
            });
        }

    };

    this.initialize();


}

function getDataArrayData(el, formData, deletedFiles) {
    let parentId;
    if ($(el).attr('parent')) {
        parentId = $(el).attr('parent');
    } else {
        parentId = $(el).attr('id');
    }
    let aryData = [];
    $(el).find('.dataArrayObject').each(function () {
        let dataObj = {};
        $(this).find('.dataArrayObjectElement').each(function () {
            let fieldName = $(this).attr('name');
            try {
                let fd = getFieldData(this);
                if (fd.isFile) {
                    if (fd.deleted === true) {
                        deletedFiles.push(fieldName);
                    }
                    if (fd.value !== null) {
                        dataObj[fieldName] = parentId + '_' + fieldName + '_' + aryData.length;
                        formData[parentId + '_' + fieldName + '_' + aryData.length] = fd.value;
                    }
                } else {
                    if (fd.value !== null) {
                        dataObj[fieldName] = fd.value;
                    }
                }
            } catch (e) {
                throw e;
            }
        });
        aryData.push(dataObj);
    });
    return aryData;
}

function getDataObjectData(el, formData, deletedFiles) {
    let parentId = $(el).attr('id');
    let dataObj = {};
    $(el).find('.dataObjectElement').each(function () {
        let fieldName = $(this).attr('name');
        try {
            let fd = getFieldData(this);
            if (fd.isFile) {
                if (fd.deleted === true) {
                    deletedFiles.push(fieldName);
                }
                if (fd.value !== null) {
                    dataObj[fieldName] = parentId + "_" + fieldName;
                    formData[parentId + "_" + fieldName] = fd.value;
                }
            } else {
                if (fd.value !== null) {
                    dataObj[fieldName] = fd.value;
                }
            }
        } catch (e) {
            throw e;
        }
    });
    $(el).find('.dataArray[parent=' + $(el).attr('id') + ']').each(function () {
        dataObj[$(this).attr('name')] = getDataArrayData(this, formData, deletedFiles);
    });
    return dataObj;
}

function setTableStatus(td) {
    if ($(td).html().trim().startsWith('approved')) {
        $(td).html('<small class="badge fs--1 badge-soft-success">Admin Approved</small>');
    } else if ($(td).html() === 'rejected') {
        $(td).html('<small class="badge fs--1 badge-soft-danger">Rejected</small>');
    } else if ($(td).html() === 'pending') {
        $(td).html('<small class="badge fs--1 badge-soft-warning">Pending</small>');
    } else if ($(td).html() === 'recommended' || $(td).html() === 'forwarded') {
        $(td).html('<small class="badge fs--1  badge-soft-warning">Recommended</small>');
    } else if ($(td).html() === 'approval_pending') {
        $(td).html('<small class="badge fs--1 badge-soft-success">Approval Pending</small>');
    } else if ($(td).html() === 'admin_approved' || $(td).html() === 'budget_checked' || $(td).html() === 'budget_pending') {
        $(td).html('<small class="badge fs--1 badge-soft-warning">Budget Pending</small>');
    } else if ($(td).html() === 'admin_pending') {
        $(td).html('<small class="badge fs--1 badge-soft-success">HOD Approved</small>');
    } else if ($(td).html() === 'budget_rejected') {
        $(td).html('<small class="badge fs--1 badge-soft-danger">Budget Rejected</small>');
    } else if ($(td).html() === 'requested' || $(td).html() === 'request_forwarded_admin_stage') {
        $(td).html('<small class="badge fs--1 badge-soft-warning">Requested</small>');
    } else if ($(td).html() === 'budget_approved' || $(td).html() === 'po_pending') {
        $(td).html('<small class="badge fs--1 badge-soft-warning">PO Pending</small>');
    } else if ($(td).html() === 'quotuion_approval_pending') {
        $(td).html('<small class="badge fs--1 badge-soft-warning">Quotation Approval Pending</small>');
    } else if ($(td).html() === 'initial_approved') {
        $(td).html('<small class="badge fs--1 badge-soft-warning">Quotation Pending</small>');
    }
}

function showTable() {
    $('#tableSection').fadeIn();
    $('#formSection').hide();
}

function showForm() {
    $('#formSection').fadeIn();
    $('#tableSection').hide();
}

function showQuataion() {
    $('#quatation_fields').fadeIn();
    $('#admin_fields').hide();
}

function clearField(el) {
    if ($(el).is('select')) {
        if ($(el).data('select')) {
            //            if ($(el).data('select').events.search) {
            //                $(el).data('select').setData([{text: '', placeholder: true}]);
            //            }
            $(el).data('select').val(null).trigger('change');
        } else {
            $(el).val('');
        }
    } else if ($(el).hasClass('dataArray')) {
        $(el).find('.dataArrayObject').remove();
    } else if ($(el).hasClass('dataObject')) {
        $(el).find('.dataObjectElement').val('');
        $(el).find('.dataArray[parent=' + $(el).attr('id') + ']').each(function () {
            clearField(this);
        });
    } else if ($(el).is('input[type="file"]')) {
        if ($(el).attr('preview')) {
            $(document).find('#' + $(el).attr('preview')).attr('src', '#');
        }
        $(el).val('');
        $(el).removeData('file');
    } else {
        $(el).val('');
    }
}

function setFieldData(el, data) {
    if ($(el).is('select')) {
        //console.log(el);
        //console.log(data);
        if (!data) {
            return;
        }
        if ($(el).data('select')) {
            //console.log($(el).data('select')[0]);
            //console.log(data);
            //issue here 
            if ($(el).attr('ajax')) {
                if ($(el).attr('refId')) {
                    if (!data[$(el).attr('refid')]) {
                        return;
                    }
                    $(el).empty().append('<option value="' + data[$(el).attr('refid')] + '">' + data[$(el).attr('reftxt')] + '</option>').val('id').trigger('change');
                    $(el).data('select').val(data[$(el).attr('refId')]).trigger('change');
                } else {
                    if (!data.id) {
                        return;
                    }
                    $(el).empty().append('<option value="' + data['id'] + '">' + data['text'] + '</option>').val('id').trigger('change');
                    $(el).data('select').val(data.id).trigger('change');
                }
            } else {
                $(el).data('select').val(data).trigger('change');
            }
        }
    } else if ($(el).hasClass('dataArray')) {
        let func = $(el).attr('func');
        for (var i = 0; i < data.length; i++) {
            window[func](data[i]);
        }
    } else if ($(el).hasClass('dataObject')) {
        $(el).find('.dataObjectElement').each(function () {
            setFieldData(this, data[$(this).attr('name')]);
        });
    } else if ($(el).is("input[type=file]")) {
        if ($(el).attr('preview')) {
            $(document).find('#' + $(el).attr('preview')).attr('src', data || '#');
        }
    } else if ($(el).is("input[type=radio]") | $(el).is("input[type=checkbox]")) {
        $(el).prop("checked", data);
    } else {
        $(el).val(data || '');
        if ($(el).attr('data-mask')) {
            $(el).mask($(el).attr('data-mask'), {reverse: $(el).attr('data-mask-reverse') === undefined ? false : $(el).attr('data-mask-reverse')});
        }
    }
}

//class ValidationError extends Error {
//    constructor(message, field) {
//        super(message);
//        this.field = field;
//    }
//}

function getFieldData(el) {
    let isRequired = $(el).attr('required');
    let value = $(el).val();
    if ($(el).is('input[type=radio]') | $(el).is('input[type=checkbox]')) {
        value = $(el).is(':checked') ? 'true' : 'false';
        console.log(value);
    }
    let deleted = false;
    if ($(el).is("input[type=file]") && $(el).parent().parent().find('.file-el').length > 0) {
        value = 'ok';
    }
    if (isRequired && (value === null || value.trim() === '')) {
        throw new Error("Incomplete Field!");
    }
    if ($(el).attr('maxlength') && $(el).val().trim().length > parseInt($(el).attr('maxlength'))) {
        throw new Error("Max Length Exceeded!");
    }
    if ($(this).attr('minlength') && $(el).val().trim().length < parseInt($(el).attr('minlength'))) {
        throw new Error("Min Length not Complete!");
    }
    let refId = $(el).attr('refId');
    if (refId && (value || value != null)) {
        let refObj = {};
        refObj[refId] = value;
        value = refObj;
    }
    if ($(el).is("input[type=file]")) {
        if ($(el).data('deleted')) {
            deleted = true;
        }
        if ($(el).data('file')) {
            return {value: $(el).data('file'), deleted: deleted, isFile: true};
        } else {
            let files = $(el).prop('files');
            if (files.length > 0) {
                return {value: files[0], deleted: deleted, isFile: true};
            } else {
                return {value: null, deleted: deleted, isFile: true};
            }
        }
    } else {

        if (refId) {
            return {value: value, isFile: false};
        } else {
            if ($(el).attr("data-mask")) {
                value = $(el).cleanVal();
            }
            if (!(value === null || value.trim() === '')) {
                return {value: value, isFile: false};
            } else {
                return {value: null, isFile: false};
            }
        }

    }
}

function addLoader(target) {
    var $this = $(target);
    let el = '<div class="div-loader"><div class="spinner-grow text-primary me-2" role="status"><span class="sr-only">Loading...</span></div></div>';
    $this.append(el);
}
function removeLoader(target) {
    var $this = $(target);
    $this.children(".div-loader").remove();
}

function convertToSelect2(el) {
    let url = $(el).attr('ajax');
    let placeholder = $(el).attr('placeholder');
    let templateResult = $(el).attr('templateResult');

    let options = {
        allowClear: true,
        placeholder: placeholder || 'Please Select'
                //minimumInputLength: 1
    };

    if (url) {
        options.ajax = {
            url: window.location.origin + contextPath + url,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data,
                    pagination: {
                        more: data.length === 20
                    }
                };
            },
            cache: true
        };
    }

    if (templateResult) {
        options.templateResult = formatResult;
    }
    let select = $(el).select2(options);

    $(el).data('select', select);
    return select;
}