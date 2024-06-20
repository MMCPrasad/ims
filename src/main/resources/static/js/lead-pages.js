//automatically create datatable and form data based on configs
function initiatePage(target, pageName, tableData, formData) {


    this.dataTable = null;
    let additionalData = {};
    this.setAdditionData = function (val) {
        additionalData = val;
    };
    const selector = 'input:not([ignore]):not(.dataArrayObjectElement,.dataObjectElement)[type!=search],select:not(.dataArrayObjectElement,.dataObjectElement):not([ignore]),textarea:not(.dataArrayObjectElement,.dataObjectElement):not([ignore]),.dataArray:not([parent]),.dataObject';

    this.setupDatatable = function () {

        let visibleColumCount = 0;
        for (let i = 0; i < tableData.columns.length; i++) {
            if (tableData.columns[i].visible === undefined || tableData.columns[i].visible === true) {
                visibleColumCount++;
            }
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
                    if (Object.keys(additionalData).length > 0) {
                        d.data = JSON.stringify(additionalData);
                    }
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
                    $(action_td).append('<a href="javascript:void(0)" class="reactrec" data-toggle="tooltip" data-placement="top" title="Reactivate Record"><i class="fas fa-check text-success"></i></a> <a href="javascript:void(0)" class="viewrec" data-toggle="tooltip" data-placement="top" title="View Record"><i class="fa fa-eye text-success" aria-hidden="true"></i></a>');
                } else {
                    $(action_td).append('<a href="javascript:void(0)" class="editrec me-1" data-toggle="tooltip" data-placement="top" title="Edit Record"><i class="fa fa-edit text-info"></i></a><a href="javascript:void(0)" class="delrec" data-toggle="tooltip" data-placement="top" title="Deactivate Record"><i class="far fa-trash-alt text-danger"></i></i></a> <a href="javascript:void(0)" class="viewrec" data-toggle="tooltip" data-placement="top" title="View Record"><i class="fa fa-eye text-success" aria-hidden="true"></i></a>');
                }
                $(row).append(action_td);
                setTableStatus($(row).find('td').eq(visibleColumCount - 1));
                $(row).data('id', data['id']);
                //$(row).find('[data-toggle="tooltip"]').tooltip();
            }
        });
    };


    this.setupFields = function () {
        let fields = formData.fields;
        if (!fields) {
            $(formData.customFields).appendTo($(target).find('#fields'));
        } else {
            for (let i = 0; i < fields.length; i++) {
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
                    let sel = convertToSelect2(el);
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
                if (Array.isArray(data[key]) | (typeof data[key] === 'object' && !(data[key] instanceof File | data[key] instanceof Blob) && data[key] !== null)) {
                    fd.append(key, JSON.stringify(data[key]));
                } else {
                    fd.append(key, data[key]);
                }
            });
            data = fd;
        }

        //console.log(data);

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
                    reload_dashboard_details();
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
                    reload_dashboard_details();
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
            $('#saveBtn').html('<i class="fas fa-save"></i> Save');
            obj.clearForm();
            if (formData.afterSaveScreen) {
                formData.afterSaveScreen();
            }
            showForm();
        });
        $(target).find('#cancelBtn').click(function () {
            showTable();
        });
        $(target).find('#cancelTopBtn').click(function () {
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
                        reload_dashboard_details();
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
                        reload_dashboard_details();
                        Swal.fire('Successfull!', result.value.message, 'success');
                        obj.dataTable.ajax.reload();
                    }
                }
            });
        });

        $(target).find('#mainTable').on('click', '.editrec', function () {
            addLoader('#tableSection');
            let id = $(this).parents('tr').first().data('id');
            fetch(formData.url + '/' + id)
                    .then(resp => resp.json())
                    .then(resp => {
                        obj.clearForm();
                        $(target).find('#formSection').find(selector).each(function () {
                            let data = resp.data[$(this).attr('id')];
                            if (data === undefined) {
                                return;
                            }
                            setFieldData(this, data);
                        });
                        if (formData.afterFieldSet) {
                            formData.afterFieldSet(resp.data);
                        }
                        removeLoader('#tableSection');
                        showForm();
                        $('#saveBtn').data('mode', 'update');
                        $('#saveBtn').html('<i class="fas fa-save"></i> Update');
                        $('#saveBtn').data('id', id);
                    });
        });



        $(target).find('#mainTable').on('click', '.viewrec', function () {
            addLoader('#tableSection');
            let id = $(this).parents('tr').first().data('id');
            fetch(formData.url + '/report/' + id)
                    .then(resp => resp.json())
                    .then(resp => {

                        $('#basic_table_tbody').find('tr').find('td').eq(0).html(resp.data.nic ? resp.data.nic : 'N/A');
                        $('#basic_table_tbody').find('tr').find('td').eq(1).html(resp.data.title.text + "." + ((resp.data.fullName) ? resp.data.fullName : 'N/A'));
                        $('#basic_table_tbody').find('tr').find('td').eq(2).html(resp.data.gender.text ? resp.data.gender.text : 'N/A');
                        $('#basic_table_tbody').find('tr').find('td').eq(3).html(resp.data.dateOfBirth ? resp.data.dateOfBirth : 'N/A');

                        $('#contact_table1_tbody').find('td').eq(0).find('div').eq(0).html(resp.data.permanentAddressL1);
                        $('#contact_table1_tbody').find('td').eq(0).find('div').eq(1).html(resp.data.permanentAddressL2);
                        $('#contact_table1_tbody').find('td').eq(0).find('div').eq(2).html(resp.data.permanentAddressL3);
                        $('#contact_table1_tbody').find('td').eq(0).find('div').eq(3).html(resp.data.permanentCity.text);


                        $('#contact_table1_tbody').find('td').eq(1).find('div').eq(0).html(resp.data.residentialAddressL1);
                        $('#contact_table1_tbody').find('td').eq(1).find('div').eq(1).html(resp.data.residentialAddressL2);
                        $('#contact_table1_tbody').find('td').eq(1).find('div').eq(2).html(resp.data.residentialAddressL3);
                        $('#contact_table1_tbody').find('td').eq(1).find('div').eq(3).html(resp.data.residentialCity.text);


                        let count_mobile = resp.data.mobiles.length;
                        $('#contact_table2_tbody').find('td').eq(0).empty();
                        for (let i = 0; i < count_mobile; i++) {
                            $('#contact_table2_tbody').find('td').eq(0).append('<div>' + resp.data.mobiles[i].number + '</div>');
                        }


                        let count_tel = resp.data.telephones.length;
                        $('#contact_table2_tbody').find('td').eq(1).empty();
                        for (let i = 0; i < count_tel; i++) {
                            $('#contact_table2_tbody').find('td').eq(1).append('<div>' + resp.data.telephones[i].number + '</div>');
                        }



                        let count_email = resp.data.emails.length;
                        $('#contact_table2_tbody').find('td').eq(2).empty();
                        for (let i = 0; i < count_email; i++) {
                            $('#contact_table2_tbody').find('td').eq(2).append('<div>' + resp.data.emails[i].email + '</div>');
                        }


                        $('#lead_table_body').find('tr').find('td').eq(0).html(resp.data.leadCode ? resp.data.leadCode : 'N/A');
                        $('#lead_table_body').find('tr').find('td').eq(1).html((resp.data.leadChannel.text) ? resp.data.leadChannel.text : 'N/A');
                        $('#lead_table_body').find('tr').find('td').eq(2).html((resp.data.leadStage.text) ? resp.data.leadStage.text : 'N/A');
                        $('#lead_table_body').find('tr').find('td').eq(3).html(resp.data.product.text ? resp.data.product.text : 'N/A');
                        $('#lead_table_body').find('tr').find('td').eq(4).html((resp.data.vehicleNumber) ? resp.data.vehicleNumber : 'N/A');
                        $('#lead_table_body').find('tr').find('td').eq(5).html(resp.data.clientType.text ? resp.data.clientType.text : 'N/A');
                        $('#lead_table_body').find('tr').find('td').eq(6).html(resp.data.mileage ? resp.data.mileage : 'N/A');



                        $('#followup_table_body').find('tr').find('td').eq(0).html(resp.data.marketingOfficer.text ? resp.data.marketingOfficer.text : 'N/A');
                        $('#followup_table_body').find('tr').find('td').eq(1).html((resp.data.branch.text) ? resp.data.branch.text : 'N/A');
                        $('#followup_table_body').find('tr').find('td').eq(2).html(resp.data.followupActionDate ? resp.data.followupActionDate : 'N/A');
                        $('#followup_table_body').find('tr').find('td').eq(3).html(resp.data.followupAction ? resp.data.followupAction : 'N/A');
                        $('#followup_table_body').find('tr').find('td').eq(4).html((resp.data.comment) ? resp.data.comment : 'N/A');



                        $('#reportCode').html(resp.data.leadCode ? resp.data.leadCode : 'N/A');
                        $('#generated_by').html(resp.data.userName ? resp.data.userName : 'N/A');
                        $('#report_name').html("Lead Report");



                        let currentDate = new Date();
                        let formattedDate = currentDate.getFullYear() + '/' +
                                ('0' + (currentDate.getMonth() + 1)).slice(-2) + '/' +
                                ('0' + currentDate.getDate()).slice(-2);
                        let hours = currentDate.getHours();
                        let minutes = currentDate.getMinutes();
                        let ampm = hours >= 12 ? 'p.m.' : 'a.m.';
                        hours = hours % 12;
                        hours = hours ? hours : 12; // Handle midnight (0 hours)
                        minutes = ('0' + minutes).slice(-2);
                        let formattedTime = hours + '.' + minutes + ' ' + ampm;
                        let formattedDateTime = formattedDate + ' (' + formattedTime + ')';
                        $('#generated_time').html(formattedDateTime);


                        $('#historyLeadList').html('');
                        let count_historyList = resp.data.historyDetailsList.length;

                        for (let i = 0; i < count_historyList; i++)
                        {

                            let name = resp.data.historyDetailsList[i].userHistory;
                            let action = resp.data.historyDetailsList[i].actionHistory;
                            let  followupaction = resp.data.historyDetailsList[i].followupActionHistory;
                            let date = resp.data.historyDetailsList[i].dateHistory;
                            let stage = resp.data.historyDetailsList[i].leadStageHistory;
                            let officer = resp.data.historyDetailsList[i].marketingOfficerHistory;



                            fillHistryTimeLine(name, action, followupaction, date, stage, officer);
                        }





                        function fillHistryTimeLine(name, action, followupaction, date, stage, officer) {

                            var temp = $("<li class='timeline-item mb-5'>").html(
                                    '<span class="timeline-icon"> <i class="fas fa-rocket text-primary fa-sm fa-fw"></i>  </span>' +
                                    ' <h6 class="font-size-16 mb-3 text-dark fw-bold"><span calss="text-capitalize">' + action + '</span> by <span>' + name + '</span></h6>' +
                                    '<div class="fs-10" style="max-width: 25rem;">' +
                                    '<a class="notification" href="#!">' +
                                    '<div class="notification-avatar"><div class="avatar avatar-2xl me-3">  <img class="rounded-circle" src="img/team/avatar.png" alt="" /> </div> </div>' +
                                    '<div class="notification-body">' +
                                    '<p class="mb-1"><strong>Action : </strong> <span>' + followupaction + '</span></p>' +
                                    '<p class="mb-1"><strong>Stage : </strong> <span>' + stage + '</span></p>' +
                                    '<p class="mb-1"><strong>Officer : </strong> <span>' + officer + '</span></p>' +
                                    ' <span class="notification-time"><span class="me-2" role="img" aria-label="Emoji">📆</span><span>' + date + '</span></span>' +
                                    '</div>' +
                                    '</a>' +
                                    '</div>' +
                                    ' </li>'
                                    );

                            $('#historyLeadList').append(temp);
                        }


                        showReport();
                        removeLoader('#tableSection');

                    });
        });










        $(target).find('#saveBtn').click(function () {
            let data = {};
            let deletedFiles = [];
            let valid = true;

            $('#formSection').find(selector).each(function () {
                if (!$(this).is(":visible")) {
                    return true;
                }
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

    };

    this.initialize = function () {
        let obj = this;

        $(target).load(window.location.origin + contextPath + 'templates/lead_page.html', null, function (data, status, jqXGR) {
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
            $(target).find('#tableSection .card-title').text(pageName + ' Dashbord');
            $(target).find('#formSection .card-title').text('Add/Edit ' + pageName);
            obj.setupCommonOperations();
            obj.setupDatatable();
            obj.setupFields();
        });
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
    if ($(td).html().trim().startsWith('active')) {
        $(td).html('<small class="badge fs--1 w-100 badge-soft-success">Active</small>');
    } else if ($(td).html() === 'inactive') {
        $(td).html('<small class="badge fs--1 w-100 badge-soft-secondary">Inactive</small>');
    }
}

function showTable() {
    $('#tableSection').fadeIn();
    $('#formSection').hide();
    $('#indetailsSection').hide();

}

function showForm() {
    $('#formSection').fadeIn();
    $('#tableSection').hide();
    $('#indetailsSection').hide();
}

function showReport() {
    $('#formSection').hide();
    $('#tableSection').hide();
    $('#indetailsSection').fadeIn();
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
        if (!data) {
            return;
        }
        if ($(el).data('select')) {
            //console.log($(el).data('select')[0]);
            //console.log(data);
            //issue here 

            if ($(el).attr('multiple')) {
                if ($(el).attr('ajax')) {
                    if ($(el).attr('refId')) {
                        let valuesToSet = [];
                        for (let i = 0; i < data.length; i++) {
                            $(el).empty().append('<option value="' + data[i][$(el).attr('refid')] + '">' + data[i][$(el).attr('reftxt')] + '</option>').val('id').trigger('change');
                            valuesToSet.push(data[i][$(el).attr('refid')]);
                        }
                        $(el).data('select').val(valuesToSet).trigger('change');
                    } else {
                        let valuesToSet = [];
                        for (let i = 0; i < data.length; i++) {
                            $(el).empty().append('<option value="' + data[i]['id'] + '">' + data[i]['text'] + '</option>').val('id').trigger('change');
                            valuesToSet.push(data[i]['id']);
                        }
                        $(el).data('select').val(valuesToSet).trigger('change');
                    }
                } else {
                    $(el).data('select').val(data).trigger('change');
                }
            } else {
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


        }
    } else if ($(el).hasClass('dataArray')) {
        let func = $(el).attr('func');
        for (let i = 0; i < data.length; i++) {
            window[func](data[i]);
        }
    } else if ($(el).hasClass('dataObject')) {
        $(el).find('.dataObjectElement').each(function () {
            setFieldData(this, data[$(this).attr('name')]);
        });
    } else if ($(el).is("input[type=file]")) {
        if ($(el).attr('preview')) {
            $(document).find('#' + $(el).attr('preview')).attr('src', data || '#');
        } else {
            let docEl = '<div class="file-el border px-2 rounded-3 d-flex flex-between-center bg-white dark__bg-1000 my-1"><span class="fs-1 far fa-file"></span><span class="ms-2"><a href="' + data + '" target="_blank">Click to View</a></span><a class="text-300 p-1 ms-6 deleteFileBtn" href="#!" data-bs-toggle="tooltip" data-bs-placement="right" title="Detach"><span class="fas fa-times"></span></a></div>';
            let doc = document.createElement('div');
            $(doc).html(docEl);
            $(doc).find('.deleteFileBtn').click(function () {
                $(this).parent().parent().find('input').show();
                $(this).parent().parent().find('input').data('deleted', true);
                $(this).parent().parent().find('.file-el').remove();
            });
            $(el).after($(doc).children());
            $(el).hide();
        }
    } else if ($(el).is("input[type=radio]") | $(el).is("input[type=checkbox]")) {
        $(el).prop("checked", data);
    } else {
        $(el).val(data);
        if ($(el).attr('data-mask')) {
            $(el).mask($(el).attr('data-mask'), {reverse: $(el).attr('data-mask-reverse') === undefined ? false : $(el).attr('data-mask-reverse')});
        }
    }
}

class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.field = field;
    }
}

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
    if (refId && (value || value !== null)) {
        if ($(el).attr('multiple')) {
            let refArray = [];
            for (let i = 0; i < value.length; i++) {
                refArray.push({refId: value[i]});
            }
            value = refArray;
        } else {
            let refObj = {};
            refObj[refId] = value;
            value = refObj;
        }
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
        if (refId !== undefined | $(el).attr('multiple') !== undefined) {
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
    let $this = $(target);
    let el = '<div class="div-loader"><div class="spinner-grow text-primary me-2" role="status"><span class="sr-only">Loading...</span></div></div>';
    $this.append(el);
}
function removeLoader(target) {
    let $this = $(target);
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






function initiateApprovalPage(target, pageName, tableData, formData) {

    this.initialize = function () {
        let obj = this;

        $(target).load(window.location.origin + contextPath + 'templates/approval-page.html', null, function (data, status, jqXGR) {
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
            $(target).find('#formSection .card-title').text('Add/Edit ' + pageName);
            obj.setupCommonOperations();
            obj.setupDatatable();
            obj.setupFields();
        });
    };

    this.initialize();

    this.setupDatatable = function () {

        for (let i = 0; i < tableData.columns.length; i++) {
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
                    $(action_td).append('<a href="javascript:void(0)" class="reactrec" data-toggle="tooltip" data-placement="top" title="Reactivate Record"><i class="fas fa-check text-success"></i></a>');
                } else {
                    $(action_td).append('<a href="javascript:void(0)" class="editrec me-1" data-toggle="tooltip" data-placement="top" title="Edit Record"><i class="fa fa-edit text-info"></i></a><a href="javascript:void(0)" class="delrec" data-toggle="tooltip" data-placement="top" title="Deactivate Record"><i class="far fa-trash-alt text-danger"></i></i></a>');
                }
                $(row).append(action_td);
                setTableStatus($(row).find('td').eq(tableData.columns.length - 2));
                $(row).data('id', data['id']);
                //$(row).find('[data-toggle="tooltip"]').tooltip();
            }
        });
    };


    this.setupFields = function () {
        let fields = formData.fields;
        if (!fields) {
            $(formData.customFields).appendTo($(target).find('#fields'));
        } else {
            for (let i = 0; i < fields.length; i++) {
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
                    $(el).attr('readonly', true);
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
                    $(el).attr('readonly', true);
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
                    $(el).attr('readonly', true);
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
                    $(el).attr('readonly', true);
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
                    let sel = convertToSelect2(el);
                    if (fields[i].change) {
                        $(el).change(fields[i].change);
                    }
                    if (fields[i].data) {
                        sel.select2({data: fields[i].data});
                    }
                } else if (fields[i].type === 'int') {
                    let el = document.createElement('input');
                    $(el).attr('readonly', true);
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
                    $(el).attr('readonly', true);
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
                    $(el).attr('readonly', true);
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

    this.clearForm = function () {
        $(target).find('#formSection').find(selector).each(function () {
            clearField(this);
        });
    };

    this.setupCommonOperations = function () {
        let obj = this;
        $(target).find('#addBtn').click(function () {
            $('#saveBtn').data('mode', 'save');
            $('#saveBtn').html('<i class="fas fa-save"></i> Save');
            obj.clearForm();
            if (formData.afterSaveScreen) {
                formData.afterSaveScreen();
            }
            showForm();
        });
        $(target).find('#cancelBtn').click(function () {
            showTable();
        });

        $(target).find('#mainTable').on('click', '.viewrec', function () {
            addLoader('#tableSection');
            let id = $(this).parents('tr').first().data('id');
            fetch(formData.url + '/' + id)
                    .then(resp => resp.json())
                    .then(resp => {
                        obj.clearForm();
                        $(target).find('#formSection').find(selector).each(function () {
                            let data = resp.data[$(this).attr('id')];
                            if (data === undefined) {
                                return;
                            }
                            setFieldData(this, data);
                        });
                        if (formData.afterFieldSet) {
                            formData.afterFieldSet(resp.data);
                        }
                        removeLoader('#tableSection');
                        showForm();
                        $('#approveBtn').data('id', id);
                    });
        });

        $(target).find('#approveBtn').click(function () {

        });

    };

    this.approveRecord = function (recordId) {

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
                return fetch(formData.url + '/approve', {
                    method: 'POST',
                    body: JSON.stringify({id: recordId}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
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

}