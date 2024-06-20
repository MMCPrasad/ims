function teller(target, pageName, endPoint, type, tableData, formData) {
    this.dataTable = null;
    const selector =
            "input:not([ignore]):not(.dataArrayObjectElement,.dataObjectElement)[type!=search],select:not(.dataArrayObjectElement,.dataObjectElement):not([ignore]),textarea:not(.dataArrayObjectElement,.dataObjectElement):not([ignore]),.dataArray:not([parent]),.dataObject";

    this.setupDatatable = function () {
        for (var i = 0; i < tableData.columns.length; i++) {
            $(target)
                    .find("#mainTable thead")
                    .find("tr")
                    .first()
                    .append("<th>" + tableData.columns[i].name + "</th>");
            delete tableData.columns[i].name;
        }
        $(target)
                .find("#mainTable thead")
                .find("tr")
                .first()
                .append('<th style="width:1px;">Action</th>');

        this.dataTable = $(target)
                .find("#mainTable")
                .DataTable({
                    aLengthMenu: [
                        [5, 10, 25, -1],
                        [5, 10, 25, "All"],
                    ],
                    pageLength: tableData.pageLength || 10,
                    ordering: true,
                    autoWidth: false,
                    processing: true,
                    serverSide: true,
                    order: [[0, "desc"]],
                    searchHighlight: true,
                    searchDelay: 350,
                    ajax: {
                        url: tableData.url,
                        contentType: "application/json",
                        type: "POST",
                        data: function (d) {
                            return JSON.stringify(d);
                        },
                        error: function (xhr, error, code) {
                            console.log(xhr);
                            console.log(code);
                        },
                    },
                    columns: tableData.columns,
                    createdRow:
                            tableData.createdRow ||
                            function (row, data) {
                                let action_td = document.createElement("td");
                                $(action_td).addClass("text-center");
                                if (data["status"] === "inactive") {
                                    $(action_td).append(
                                            '<a href="javascript:void(0)" class="reactrec" data-toggle="tooltip" data-placement="top" title="Reactivate Record"><i class="fas fa-check h6 text-success"></i></a>'
                                            );
                                } else {
                                    $(action_td).append(
                                            '<a href="javascript:void(0)" class="editrec me-1" data-toggle="tooltip" data-placement="top" title="Edit Record"><i class="fa fa-eye h6 text-info" style="color: #000000;"></i></a>'
                                            );
                                }
                                $(row).append(action_td);
                                setTableStatus(
                                        $(row)
                                        .find("td")
                                        .eq(tableData.columns.length - 2)
                                        );
                                $(row).data("id", data["id"]);
                                //$(row).find('[data-toggle="tooltip"]').tooltip();
                            },
                });
    };

    this.setupFields = function () {
        let fields = formData.fields;
        if (!fields) {
            $(formData.customFields).appendTo($(target).find("#fields"));
        } else {
            for (var i = 0; i < fields.length; i++) {
                let div = document.createElement("div");
                $(div).addClass("mb-3 col-" + fields[i].col);
                if (fields[i].hidden) {
                    $(div).attr("style", "display:none;");
                }
                let mandatory = "";
                if (fields[i].mandatory) {
                    mandatory = ' <span class="text-danger">*</span>';
                }
                $(div).append(
                        '<label class="col-form-label">' +
                        fields[i].name +
                        mandatory +
                        "</label>"
                        );

                if (fields[i].type === "text") {
                    let el = document.createElement("input");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    $(el).attr("type", "text");
                    $(el).attr("autocomplete", "off");
                    $(el).addClass("form-control");
                    $(el).attr("id", fields[i].id);
                    $(div).append(el);
                } else if (fields[i].type === "date") {
                    let el = document.createElement("input");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    $(el).attr("type", "date");
                    $(el).attr("autocomplete", "off");
                    $(el).addClass("form-control");
                    $(el).attr("id", fields[i].id);
                    $(div).append(el);
                } else if (fields[i].type === "texta") {
                    let el = document.createElement("textarea");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    $(el).attr("autocomplete", "off");
                    $(el).addClass("form-control");
                    $(el).attr("id", fields[i].id);
                    $(div).append(el);
                } else if (fields[i].type === "select") {
                    let el = document.createElement("select");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    if (fields[i].ajax) {
                        $(el).attr("ajax", fields[i].ajax);
                    }
                    if (fields[i].refId) {
                        $(el).attr("refId", fields[i].refId);
                        $(el).attr("reftxt", fields[i].refTxt);
                    }
                    $(el).addClass("form-select selectpicker");
                    $(el).attr("id", fields[i].id);
                    $(div).append(el);
                    var sel = convertToSelect2(el);
                    if (fields[i].change) {
                        $(el).change(fields[i].change);
                    }
                    if (fields[i].data) {
                        sel.select2({data: fields[i].data});
                    }
                } else if (fields[i].type === "int") {
                    let el = document.createElement("input");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    $(el).attr("type", "text");
                    $(el).attr("autocomplete", "off");
                    $(el).addClass("form-control autoint");
                    $(el).attr("id", fields[i].id);
                    $(el).autoNumeric({mDec: "0"});
                    $(div).append(el);
                } else if (fields[i].type === "double") {
                    let el = document.createElement("input");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    $(el).attr("type", "text");
                    $(el).attr("autocomplete", "off");
                    $(el).addClass("form-control autodouble");
                    $(el).attr("id", fields[i].id);
                    $(el).autoNumeric();
                    $(div).append(el);
                } else if (fields[i].type === "file") {
                    let el = document.createElement("input");
                    if (fields[i].mandatory) {
                        $(el).attr("required", true);
                    }
                    if (fields[i].disableOnEdit) {
                        $(el).attr("doe", true);
                    }
                    $(el).attr("type", "file");
                    $(el).attr("autocomplete", "off");
                    $(el).addClass("form-control");
                    $(el).attr("id", fields[i].id);
                    $(div).append(el);
                }
                $(target).find("#fields").append(div);
            }
        }
    };

    this.saveRecord = function (data) {
        let headers = {};
        if (formData.contentType === "json") {
            data = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
        } else {
            let fd = new FormData();
            Object.keys(data).forEach((key) => {
                fd.append(key, data[key]);
            });
            data = fd;
        }

        console.log(data);

        Swal.fire({
            title: "Are you sure?",
            text: "This record will be saved !",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4bbf73",
            cancelButtonColor: "#495057",
            confirmButtonText: "Yes, Continue!",
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                return fetch(formData.url, {
                    method: "POST",
                    body: data,
                    headers: headers,
                })
                        .then((response) => {
                            //session timeout
                            if (response.status === 302) {
                                throw new Error(
                                        "session Timed out !, Please login to continue !"
                                        );
                            }
                            //unexpected Error
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.json();
                        })
                        .catch((error) => {
                            Swal.showValidationMessage("Request failed:" + error);
                        });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.value) {
                if (result.value.status !== "success") {
                    Swal.fire("Error!", result.value.message, "error");
                } else {
                    Swal.fire("Successfull!", result.value.message, "success");
                    this.dataTable.ajax.reload();
                    showTable();
                }
            }
        });
    };

    this.updateRecord = function (data) {
        let headers = {};
        if (formData.contentType === "json") {
            data = JSON.stringify(data);
            headers["Content-Type"] = "application/json";
        } else {
            let fd = new FormData();
            Object.keys(data).forEach((key) => {
                //console.log(data[key]);
                if (
                        Array.isArray(data[key]) |
                        (typeof data[key] === "object" &&
                                !((data[key] instanceof File) | (data[key] instanceof Blob)) &&
                                data[key] !== null)
                        ) {
                    fd.append(key, JSON.stringify(data[key]));
                } else {
                    fd.append(key, data[key]);
                }
            });
            data = fd;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This record will be Updated !",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#4bbf73",
            cancelButtonColor: "#495057",
            confirmButtonText: "Yes, Continue!",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return fetch(formData.url, {
                    method: "PUT",
                    body: data,
                    headers: headers,
                })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(response.statusText);
                            }
                            return response.json();
                        })
                        .catch((error) => {
                            Swal.showValidationMessage("Request failed:" + error);
                        });
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.value) {
                if (result.value.status !== "success") {
                    Swal.fire("Error!", result.value.message, "error");
                } else {
                    Swal.fire("Successfull!", result.value.message, "success");
                    this.dataTable.ajax.reload();
                    showTable();
                }
            }
        });
    };

    this.clearForm = function () {
        $(target)
                .find("#formSection")
                .find(selector)
                .each(function () {
                    clearField(this);
                });
    };

    this.setupCommonOperations = function () {
        let obj = this;
        $(target)
                .find("#addBtn")
                .click(function () {
                    $("#saveBtn").data("mode", "save");
                    $("#rejectBtn").data("mode", "save");
                    $("#saveBtn").html('<i class="feather icon-save"></i> Save');
                    obj.clearForm();
                    if (formData.afterSaveScreen) {
                        formData.afterSaveScreen();
                    }
                    showForm();
                });
        $(target)
                .find("#cancelBtn")
                .click(function () {
                    showTable();
                });

        let approval_table_id;

        $(target)
                .find("#mainTable")
                .on("click", ".editrec", function () {
                    addLoader("#tableSection");
                    let id = $(this).parents("tr").first().data("id");
                  
                    approval_table_id = id;
                    fetch(formData.url + "/" + id)
                            .then((resp) => resp.json())
                            .then((resp) => {
                                obj.clearForm();
                                $(target)
                                        .find("#formSection")
                                        .find(selector)
                                        .each(function () {
                                            let data = resp.data[$(this).attr("id")];
                                            if (!data) {
                                                return;
                                            }
                                            setFieldData(this, data);
                                        });
                                if (formData.afterFieldSet) {
                                    formData.afterFieldSet(resp.data);
                                }
                                removeLoader("#tableSection");
                                showForm();
                                $("#saveBtn").data("mode", "update");
                                $("#saveBtn").html('<i class="feather icon-save"></i> Save');
                                $("#saveBtn").data("id", id);
                            });
                });

        $(target)
                .find("#saveBtn")
                .click(function () {
                    let data = {};
                    let deletedFiles = [];
                    let valid = true;

                    $("#formSection")
                            .find(selector)
                            .each(function () {
                                let fieldName = $(this).parent().find("label").html();
                                let fieldId = $(this).attr("id");

                                try {
                                    if ($(this).hasClass("dataArray")) {
                                        data[fieldId] = getDataArrayData(this, data, deletedFiles);
                                    } else if ($(this).hasClass("dataObject")) {
                                        data[fieldId] = JSON.stringify(
                                                getDataObjectData(this, data, deletedFiles)
                                                );
                                    } else {
                                        let fd = getFieldData(this);
                                        if (fd.value !== null) {
                                            data[fieldId] = fd.value;
                                        }
                                        if (fd.deleted !== "undefined" && fd.deleted === true) {
                                            deletedFiles.push(fieldId);
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                    Swal.fire(e.message, fieldName, "warning");
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

                    if ($("#saveBtn").data("mode") === "update") {
                        data["id"] = $("#saveBtn").data("id");
                        if (deletedFiles.length > 0) {
                            data["deleted"] = JSON.stringify(deletedFiles);
                        }
                        obj.updateRecord(data);
                    } else {
                        obj.saveRecord(data);
                    }
                });

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // function for approve reject recommend button
        function handleActionBtnClick(action) {
            let data = {
                type: type,
                id: approval_table_id,
                openDate: $('#dateOpen').val(),
                openTime: $('#timeOpen').val(),
                closeTime: $('#timeClose').val(),
                closeDate: $('#dateClose').val(),
                closingBalance: $('#closingBalance').val(),
                openingBalance: $('#openningBalance').val(),
                tellerStatus: $('#tellerStatus').val()
            };

            let headers = {
                "Content-Type": "application/json"
            };

            Swal.fire({
                title: "Are you sure?",
                text: "This record will be " + action + "!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#4bbf73",
                cancelButtonColor: "#495057",
                confirmButtonText: "Yes, Continue!",
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading(),
                preConfirm: () => {
                    return fetch(endPoint + "/" + action, {
                        method: "PUT",
                        body: JSON.stringify(data),
                        headers: headers
                    })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error("Network response was not ok.");
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data.status === "success") {
                                    return data.message;
                                } else {
                                    throw new Error(data.message);
                                }
                            })
                            .catch(error => {
                                throw new Error("Failed to update record: " + error.message);
                            });
                }
            })
                    .then(result => {
                        Swal.fire("Successful!", result, "success").then(() => {
                            location.reload();
                        });
                    })
                    .catch(error => {
                        Swal.fire("Error!", error.message, "error");
                    });
        }



        $("#save-button").click(function () {
            handleActionBtnClick("update");
        });



        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //        $('#page').find('#recoBtn').click(function () {
        //
        //            let data = {};
        //            data.requestBy = $('#requestBy').val();
        //            data.requestId = $('#requestId').val();
        //            data.description = $('#description').val();
        //            data.hodMessage = $('#hodMessage').val();
        //            data.id = approval_table_id;
        //            alert(data.id);
        //            ////////////////////////////////////////////////////////////////////////////////////////////////
        //            let department = {
        //                id: $('#department').val(),
        //                text: $($('#department')).text()
        //            };
        //            data.department = department;
        //            ////////////////////////////////////////////////////////////////////////////////////////////////
        //            let subCategory = {
        //                id: $('#subCategory').val(),
        //                text: $($('#subCategory')).text()
        //            };
        //            data.subCategory = subCategory;
        //            ////////////////////////////////////////////////////////////////////////////////////////////////
        //            let username = {
        //                id: $('#subCategory').val(),
        //                text: $($('#subCategory')).text()
        //            };
        //            data.username = username;
        //            ////////////////////////////////////////////////////////////////////////////////////////////////
        //            let recommendTo = {
        //                id: $('#recommendTo').val(),
        //                text: $($('#recommendTo')).text()
        //            };
        //            data.recommendTo = recommendTo;
        //
        //            let jsonData = JSON.stringify(data);
        //
        //            alert(jsonData);
        //
        //            let headers = {
        //                'Content-Type': 'application/json'
        //            };
        //
        //
        //            Swal.fire({
        //                title: 'Are you sure?',
        //                text: "This record will be saved !",
        //                icon: 'question',
        //                showCancelButton: true,
        //                confirmButtonColor: '#4bbf73',
        //                cancelButtonColor: '#495057',
        //                confirmButtonText: 'Yes, Continue!',
        //                showLoaderOnConfirm: true,
        //                preConfirm: async () => {
        //                    return fetch("fa_request/save", {
        //                        method: 'POST',
        //                        body: jsonData,
        //                        headers: headers
        //                    }).then(response => {
        //                        //session timeout
        //                        if (response.status === 302) {
        //                            throw new Error("session Timed out !, Please login to continue !");
        //                        }
        //                        //unexpected Error
        //                        if (!response.ok) {
        //                            throw new Error(response.statusText);
        //                        }
        //                        return response.json();
        //                    }).catch(error => {
        //                        Swal.showValidationMessage('Request failed:' + error);
        //                    });
        //                },
        //                allowOutsideClick: () => !Swal.isLoading()
        //
        //            }).then((result) => {
        //                if (result.value) {
        //                    if (result.value.status !== 'success') {
        //                        Swal.fire('Error!', result.value.message, 'error');
        //                    } else {
        //                        fetch("fa_request/recommend", {
        //                            method: 'PUT',
        //                            body: jsonData,
        //                            headers: headers
        //                                    // You may need to provide additional data or modify this request as needed
        //                        }).then(response => {
        //                            if (!response.ok) {
        //                                throw new Error(response.statusText);
        //                            }
        //                            return response.json();
        //                        }).then(updatedResult => {
        //                            // Handle the response of the update request
        //                            if (updatedResult.status === 'success') {
        //                                Swal.fire('Successfull!', updatedResult.message, 'success').then(() => {
        //                                    // Reload the Page
        //                                    location.reload();
        //                                });
        //                            } else {
        //                                Swal.fire('Error!', updatedResult.message, 'error');
        //                            }
        //                        }).catch(error => {
        //                            Swal.fire('Error!', 'Failed to update record: ' + error, 'error');
        //                        });
        //                    }
        //                }
        //            });
        //        });
    };

    this.initialize = function () {
        let obj = this;

        $(target).load(
                window.location.origin + contextPath + "templates/teller.html",
                null,
                function (data, status, jqXGR) {
                    if (formData.formSize) {
                        $(target)
                                .find("#formSection")
                                .removeClass()
                                .addClass(formData.formSize);
                    }
                    if (tableData.tableSize) {
                        $(target)
                                .find("#tableSection")
                                .removeClass()
                                .addClass(tableData.tableSize);
                    }
                    if (
                            typeof tableData.showBorders !== "undefined" &&
                            tableData.showBorders === false
                            ) {
                        $(target).find("#mainTable").removeClass("table-bordered");
                    }
                    if (
                            typeof tableData.hover !== "undefined" &&
                            tableData.hover === true
                            ) {
                        $(target).find("#mainTable").addClass("table-hover");
                    }
                    $(target)
                            .find("#tableSection .card-title")
                            .text("Search " + pageName);
                    $(target)
                            .find("#formSection .card-title")
                            .text(pageName);
                    obj.setupCommonOperations();
                    obj.setupDatatable();
                    obj.setupFields();
                }
        );
    };

    this.initialize();
}

function getDataArrayData(el, formData, deletedFiles) {
    let parentId;
    if ($(el).attr("parent")) {
        parentId = $(el).attr("parent");
    } else {
        parentId = $(el).attr("id");
    }
    let aryData = [];
    $(el)
            .find(".dataArrayObject")
            .each(function () {
                let dataObj = {};
                $(this)
                        .find(".dataArrayObjectElement")
                        .each(function () {
                            let fieldName = $(this).attr("name");
                            try {
                                let fd = getFieldData(this);
                                if (fd.isFile) {
                                    if (fd.deleted === true) {
                                        deletedFiles.push(fieldName);
                                    }
                                    if (fd.value !== null) {
                                        dataObj[fieldName] =
                                                parentId + "_" + fieldName + "_" + aryData.length;
                                        formData[parentId + "_" + fieldName + "_" + aryData.length] =
                                                fd.value;
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
    let parentId = $(el).attr("id");
    let dataObj = {};
    $(el)
            .find(".dataObjectElement")
            .each(function () {
                let fieldName = $(this).attr("name");
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
    $(el)
            .find(".dataArray[parent=" + $(el).attr("id") + "]")
            .each(function () {
                dataObj[$(this).attr("name")] = getDataArrayData(
                        this,
                        formData,
                        deletedFiles
                        );
            });
    return dataObj;
}

function setTableStatus(td) {
    if ($(td).html().trim().startsWith("close")) {
        $(td).html(
                '<small class="badge fs--1 w-100 badge-soft-warning">Close</small>'
                );
    } else if ($(td).html() === "open") {
        $(td).html(
                '<small class="badge fs--1 w-100 badge-soft-info">Open</small>'
                );
    } else if ($(td).html() === "pending") {
        $(td).html(
                '<small class="badge fs--1 w-100 badge-soft-warning">Pending</small>'
                );
    } else if ($(td).html() === "recommended") {
        $(td).html(
                '<small class="badge fs--1 w-100 badge-soft-warning">Recommended</small>'
                );
    }
}

function showTable() {
    $("#tableSection").fadeIn();
    $("#formSection").hide();
}

function showForm() {
    $("#formSection").fadeIn();
    $("#tableSection").hide();
}

function clearField(el) {
    if ($(el).is("select")) {
        if ($(el).data("select")) {
            //            if ($(el).data('select').events.search) {
            //                $(el).data('select').setData([{text: '', placeholder: true}]);
            //            }
            $(el).data("select").val(null).trigger("change");
        } else {
            $(el).val("");
        }
    } else if ($(el).hasClass("dataArray")) {
        $(el).find(".dataArrayObject").remove();
    } else if ($(el).hasClass("dataObject")) {
        $(el).find(".dataObjectElement").val("");
        $(el)
                .find(".dataArray[parent=" + $(el).attr("id") + "]")
                .each(function () {
                    clearField(this);
                });
    } else if ($(el).is('input[type="file"]')) {
        if ($(el).attr("preview")) {
            $(document)
                    .find("#" + $(el).attr("preview"))
                    .attr("src", "#");
        }
        $(el).val("");
        $(el).removeData("file");
    } else {
        $(el).val("");
    }
}

function setFieldData(el, data) {
    if ($(el).is("select")) {
        //console.log(el);
        //console.log(data);
        if (!data) {
            return;
        }
        if ($(el).data("select")) {
            //console.log($(el).data('select')[0]);
            //console.log(data);
            //issue here
            if ($(el).attr("ajax")) {
                if ($(el).attr("refId")) {
                    if (!data[$(el).attr("refid")]) {
                        return;
                    }
                    $(el)
                            .empty()
                            .append(
                                    '<option value="' +
                                    data[$(el).attr("refid")] +
                                    '">' +
                                    data[$(el).attr("reftxt")] +
                                    "</option>"
                                    )
                            .val("id")
                            .trigger("change");
                    $(el).data("select").val(data[$(el).attr("refId")]).trigger("change");
                } else {
                    if (!data.id) {
                        return;
                    }
                    $(el)
                            .empty()
                            .append(
                                    '<option value="' + data["id"] + '">' + data["text"] + "</option>"
                                    )
                            .val("id")
                            .trigger("change");
                    $(el).data("select").val(data.id).trigger("change");
                }
            } else {
                $(el).data("select").val(data).trigger("change");
            }
        }
    } else if ($(el).hasClass("dataArray")) {
        let func = $(el).attr("func");
        for (var i = 0; i < data.length; i++) {
            window[func](data[i]);
        }
    } else if ($(el).hasClass("dataObject")) {
        $(el)
                .find(".dataObjectElement")
                .each(function () {
                    setFieldData(this, data[$(this).attr("name")]);
                });
    } else if ($(el).is("input[type=file]")) {
        if ($(el).attr("preview")) {
            $(document)
                    .find("#" + $(el).attr("preview"))
                    .attr("src", data || "#");
        }
    } else if ($(el).is("input[type=radio]") | $(el).is("input[type=checkbox]")) {
        $(el).prop("checked", data);
    } else {
        $(el).val(data || "");
        if ($(el).attr("data-mask")) {
            $(el).mask($(el).attr("data-mask"), {
                reverse:
                        $(el).attr("data-mask-reverse") === undefined
                        ? false
                        : $(el).attr("data-mask-reverse"),
            });
        }
    }
}
//
//class ValidationError extends Error {
//    constructor(message, field) {
//        super(message);
//        this.field = field;
//    }
//}

function getFieldData(el) {
    let isRequired = $(el).attr("required");
    let value = $(el).val();
    if ($(el).is("input[type=radio]") | $(el).is("input[type=checkbox]")) {
        value = $(el).is(":checked") ? "true" : "false";
        console.log(value);
    }
    let deleted = false;
    if (
            $(el).is("input[type=file]") &&
            $(el).parent().parent().find(".file-el").length > 0
            ) {
        value = "ok";
    }
    if (isRequired && (value === null || value.trim() === "")) {
        throw new Error("Incomplete Field!");
    }
    if (
            $(el).attr("maxlength") &&
            $(el).val().trim().length > parseInt($(el).attr("maxlength"))
            ) {
        throw new Error("Max Length Exceeded!");
    }
    if (
            $(this).attr("minlength") &&
            $(el).val().trim().length < parseInt($(el).attr("minlength"))
            ) {
        throw new Error("Min Length not Complete!");
    }
    let refId = $(el).attr("refId");
    if (refId && (value || value != null)) {
        let refObj = {};
        refObj[refId] = value;
        value = refObj;
    }
    if ($(el).is("input[type=file]")) {
        if ($(el).data("deleted")) {
            deleted = true;
        }
        if ($(el).data("file")) {
            return {value: $(el).data("file"), deleted: deleted, isFile: true};
        } else {
            let files = $(el).prop("files");
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
            if (!(value === null || value.trim() === "")) {
                return {value: value, isFile: false};
            } else {
                return {value: null, isFile: false};
            }
        }
    }
}

function addLoader(target) {
    var $this = $(target);
    let el =
            '<div class="div-loader"><div class="spinner-grow text-primary me-2" role="status"><span class="sr-only">Loading...</span></div></div>';
    $this.append(el);
}
function removeLoader(target) {
    var $this = $(target);
    $this.children(".div-loader").remove();
}

function convertToSelect2(el) {
    let url = $(el).attr("ajax");
    let placeholder = $(el).attr("placeholder");
    let templateResult = $(el).attr("templateResult");

    let options = {
        allowClear: true,
        placeholder: placeholder || "Please Select",
        //minimumInputLength: 1
    };

    if (url) {
        options.ajax = {
            url: window.location.origin + contextPath + url,
            dataType: "json",
            delay: 250,
            data: function (params) {
                return {
                    q: params.term,
                    page: params.page,
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data,
                    pagination: {
                        more: data.length === 20,
                    },
                };
            },
            cache: true,
        };
    }

    if (templateResult) {
        options.templateResult = formatResult;
    }
    let select = $(el).select2(options);

    $(el).data("select", select);
    return select;
}
