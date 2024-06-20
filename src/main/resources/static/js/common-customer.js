$.fn.dataTable.ext.errMode = 'none';

$(document).find('.ajax-select').each(function () {
    convertToSelect2(this);
});

$('#category').change(function () {

    if ($(this).val() === 'Individual') {
        $('#gender,#title,#firstName,#middleName,#nameWithInitials,#lastName,#preferredName').each(function () {
            $(this).parent().show();
        });
        $('#fullName').parent().find('label').html('Full Name <span class="text-danger">*</span>');
    } else {
        $('#gender,#title,#firstName,#middleName,#nameWithInitials,#lastName,#preferredName').each(function () {
            $(this).parent().hide();
        });
        $('#fullName').parent().find('label').html('Company Name <span class="text-danger">*</span>');
    }
});

function initiateCustomerPage(entityTypeName, entityTypeUrl) {

    let tableData = {
        columns: [
            {"name": "ID", "data": "id", "width": "50px"},
            {"name": "Name", "data": "fullName"},
            {"name": "Legal ID", "data": "idNo"},
            {"name": "Category", "data": "category"},
            {"name": "Types", "data": "customerTypes"},
            {"name": "Status", "data": "status", "width": "50px"}
        ],
        url: window.location.origin + contextPath + 'customer/' + entityTypeUrl + '/datatable',
        tableSize: 'col-12'
    };

    let formData = {
        url: window.location.origin + contextPath + 'customer/' + entityTypeUrl,
        customFields: $('#temp').children(),
        formSize: 'col-12',
        contentType: 'multipart',
        afterFieldSet: function (data) {
            $(document).find('#img_preview').attr('src', 'customer-images/' + data.img);
        }
    };

    new initiatePage($('#page'), entityTypeName, tableData, formData);
}

$(document).on('click', '.removeElementBtn', function () {
    $(this).parent().remove();
});

$(document).on('click', '.removeLegalIdBtn', function () {
    $(this).parent().parent().remove();
});

function addMobile(arryObj) {
    let temp = document.createElement('div');
    $(temp).addClass('input-group mb-2 dataArrayObject');
    $(temp).html('<input type="text" class="form-control w-25 dataArrayObjectElement" placeholder="Mobile Number" name="number" required="">'
            + '<button class="btn btn-outline-danger removeElementBtn" type="button"><i class="fas fa-times"></i></button>');
    if (arryObj) {
        Object.keys(arryObj).forEach(function (key) {
            setFieldData($(temp).find('[name="' + key + '"]'), arryObj[key]);
        });
    }
    $('#mobiles').append(temp);
}

$('#addMobileBtn').click(function () {
    addMobile();
});

function addTelephone(arryObj) {
    let temp = document.createElement('div');
    $(temp).addClass('input-group mb-2 dataArrayObject');
    $(temp).html('<input type="text" class="form-control w-25 dataArrayObjectElement" placeholder="Telephone Number" name="number" required="">'
            + '<button class="btn btn-outline-danger removeElementBtn" type="button"><i class="fas fa-times"></i></button>');
    if (arryObj) {
        Object.keys(arryObj).forEach(function (key) {
            setFieldData($(temp).find('[name="' + key + '"]'), arryObj[key]);
        });
    }
    $('#telephones').append(temp);
}

$('#addTelephoneBtn').click(function () {
    addTelephone();
});

function addEmail(arryObj) {
    let temp = document.createElement('div');
    $(temp).addClass('input-group mb-2 dataArrayObject');
    $(temp).html('<input type="text" class="form-control w-25 dataArrayObjectElement" placeholder="email" name="email" required="">'
            + '<button class="btn btn-outline-danger removeElementBtn" type="button"><i class="fas fa-times"></i></button>');
    if (arryObj) {
        Object.keys(arryObj).forEach(function (key) {
            setFieldData($(temp).find('[name="' + key + '"]'), arryObj[key]);
        });
    }
    $('#emails').append(temp);
}

$('#addEmailBtn').click(function () {
    addEmail();
});


function addLegalId(arryObj) {
    let temp = document.createElement('tr');
    $(temp).addClass('dataArrayObject');
    $(temp).html('<td><select class="ajax-select dataArrayObjectElement" refid="id" reftxt="text" ajax="common/id-type/select" placeholder="Id Type"  name="idType" required=""></select></td>'
            + '<td><input type="text" autocomplete="off" class="form-control dataArrayObjectElement" placeholder="Id Number" name="idNo" required=""></td>'
            + '<td><input type="date" class="form-control dataArrayObjectElement" placeholder="Issued Date" name="issuedDate" required=""></td>'
            + '<td><input type="date" class="form-control dataArrayObjectElement" placeholder="Expire Date" name="expireDate" ></td>'
            + '<td class="text-center"><input class="form-check-input dataArrayObjectElement" type="radio" placeholder="Primary Id?" name="primary" /></td>'
            + '<td><input type="hidden" class="form-control dataArrayObjectElement" placeholder="Id" name="id"><button class="btn btn-outline-danger removeLegalIdBtn" type="button"><i class="fas fa-times"></i></button></td>');
    convertToSelect2($(temp).find('select')[0]);
    //$(temp).find('.select2').attr('style', 'width: 25% !important;');
    if (arryObj) {
        Object.keys(arryObj).forEach(function (key) {
            setFieldData($(temp).find('[name="' + key + '"]'), arryObj[key]);
        });
    }
    $('#legalIds').append(temp);
}

$('#addLegalIdBtn').click(function () {
    addLegalId();
});

function addDocument(arryObj) {
    let temp = document.createElement('div');
    $(temp).addClass('input-group mb-2 dataArrayObject');
    $(temp).html('<select class="ajax-select dataArrayObjectElement" ajax="common/customer-document-type/select" placeholder="Document Type"  name="docType" required=""></select>'
            + '<input type="file" class="form-control dataArrayObjectElement" placeholder="Document" name="document" required="">'
            + '<input type="text" class="form-control dataArrayObjectElement" placeholder="Comment" name="comment" required="">'
            + '<button class="btn btn-outline-danger removeElementBtn" type="button"><i class="fas fa-times"></i></button>');
    convertToSelect2($(temp).find('select')[0]);
    $(temp).find('.select2').attr('style', 'width: 25% !important;');
    if (arryObj) {
        $(temp).find('[name="document"]').attr('type', 'text');
        Object.keys(arryObj).forEach(function (key) {
            setFieldData($(temp).find('[name="' + key + '"]'), arryObj[key]);
        });
    }
    $('#documents').append(temp);
}

$('#addDocumentBtn').click(function () {
    addDocument();
});


$('#cropit-image').change(function () {
    $('#imageCropModal').modal('show');
});

//image cropper
$(function () {
    $('.image-editor').cropit({
        imageState: {
            src: 'images/ite.png'
        }
    });

    $('.rotate-cw').click(function () {
        $('.image-editor').cropit('rotateCW');
    });
    $('.rotate-ccw').click(function () {
        $('.image-editor').cropit('rotateCCW');
    });

    $('.export').click(function () {
        var imageData = $('.image-editor').cropit('export');
        window.open(imageData);
    });
});

$('#saveCroppedImg').click(function () {
    var imageData = $('.image-editor').cropit('export');
    $("#img_preview").attr('src', imageData);
    $('#img').data('file', dataURItoBlob(imageData));
    $('#imageCropModal').modal('hide');
});

function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], {type: 'image/png', name: 'image.png'});
}

$('#imgUploadBtn').click(function () {
    $('#cropit-image').click();
});

function getFirstLetters(str) {
    let words = str.split(' ');
    let firstLetters = [];
    for (let i = 0; i < words.length; i++) {
        let firstLetter = words[i].charAt(0);
        firstLetters.push(firstLetter);
    }
    return firstLetters.join('. ');
}

$('#firstName,#middleName,#lastName').on('input', function () {
    $('#nameWithInitials').val(getFirstLetters($('#firstName').val()) + '. ' + getFirstLetters($('#middleName').val()) + '. ' + $('#lastName').val());
    $('#fullName').val($('#firstName').val() + ' ' + $('#middleName').val() + ' ' + $('#lastName').val());
});

