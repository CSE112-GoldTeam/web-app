// Script to add, remove, preview and submit form elements

var dropOptions = [];
var dropCounter = 0;
var flag = false;

// Insert options into appropriate dropdown field
function insertOption(dropcounter) {
    var dropdown = document.getElementById('drop' + dropcounter);
    var option = document.createElement('option');
    option.text = prompt ('Name your option');

    // Create array within options array for new dropdown menu
    if(! dropOptions[dropcounter]) {
       dropOptions[dropcounter] = [];
    }

    if (option.text === 'null'){
      return;
    }

    if (option.text)
    {
       dropdown.add(option);
       dropOptions[dropcounter].push(option);
    }
}

// Remove option from appropriate dropdown field
function removeOption(dropcounter) {
    var x = document.getElementById('drop' + dropcounter);
    var deleted = x.options[x.selectedIndex].text;

    var confirmRemove = confirm("Are you sure?");

    if (confirmRemove)
    {
        x.remove(x.selectedIndex);

        for (i = 0; i < dropOptions[dropcounter].length; i++) {
            if(dropOptions[dropcounter][i].text === deleted) {
                dropOptions[dropcounter].splice(i, 1);
            }
        }
    }
}

$(document).ready(function () {

    // Form exists in database
    if (form != null){
        makeForm(form);
    }

    // Update field names if deletion occurs
    function update() {
        var id = 1;
        $('#buildyourform div').each(function () {
            $(this).attr('id', id.toString());
            id++;
        });
    }

    // Add form control fields/buttons
    function addField(label, type) {
        var intId = $('#buildyourform div').length + 1;
        var fieldWrapper = $('<div class=\"fieldwrapper\" id=\"' + intId + '\"/>');
        var fName;
        var fType;
        var temp;
        var flag = false;

        if(label) {
            fName = $('<input type=\"text\" class=\"fieldname form-control col-xs-4\" value=\"' + label + '\" class=\"fieldname\" />');
        }
        else {
            fName = $('<input type=\"text\" class=\"fieldname form-control col-xs-4\" />');
        }

        // Display appropriate ordering depending on type
        if(type === 'dropdown') {
            fType = $('<select class=\"fieldtype form-control col-xs-3\"> <option selected=\"selected\" value=\"dropdown\">Drop</option> <option value=\"textbox\">Text</option></select>');
        }
        else {
            fType = $('<select class=\"fieldtype form-control col-xs-3\"><option selected=\"dropdown\" value=\"textbox\">Text</option><option value=\"dropdown\">Drop</option> </select>');
        }

        var removeButton = $('<button type="button" class="remove btn btn-default btn-danger col-xs-1s" aria-label="Left Align"><span class="glyphicon glyphicon-remove white" aria-hidden="true"></span></button>');
        removeButton.click(function () {
            var confirmRemove = confirm("Are you sure?");

            // Remove and fill preview once for deletion, and again to display results
            if (confirmRemove)
            {
                var id = $(this).parent().attr('id');
                preview(id, type);

                $(this).parent().remove();
                update();

                preview();
            }
        });

        fieldWrapper.append(fName);
        fieldWrapper.append(fType);
        fieldWrapper.append(removeButton);
        $('#buildyourform').append(fieldWrapper);

        fType.change(function() {
            typeChange($(this).parent().attr('id'));
            preview();
        });


        fName.on('input', function() {
            preview();
        });

        preview();
    }

    function typeChange(id) {
        var fieldcount = 0;
        var dropcounter = 0;

        $('#buildyourform div').each(function () {

            switch ($(this).find('select.fieldtype').first().val()) {
                case 'textbox':
                    fieldcount++;

                    if(fieldcount.toString() === id) {
                        dropcounter++;
                        dropOptions.splice(dropcounter, 1);
                    }

                    break;
                case 'dropdown':
                    fieldcount++;
                    dropcounter++;
                    break;
            }
        });
    }

    // Display elements in preview field
    function preview(removeId, type) {
        $('#yourform').remove();

        var fieldcount = 0;
        var dropcounter = 0;

        var fieldSet = $('<fieldset id=\"yourform\"><legend>Your Form</legend></fieldset>');

        // Iterate through each field and append its HTML to the preview form
        $('#buildyourform div').each(function () {
            var id = 'input' + $(this).attr('id').replace('field', '');
            var label = $('<label class=\"col-md-4\" for=\"' + id + '\">' + $(this).find('input.fieldname').first().val() + '</label>');
            var input;

            switch ($(this).find('select.fieldtype').first().val()) {
                case 'textbox':
                    fieldcount++;
                    input = $('<div class=\"previewForm col-md-8\"><input class=\"form-control\" type=\"text\" id=\"' + id + '\" name=\"' + id + '\" /></div>');
                    break;
                case 'dropdown':
                    dropcounter++;
                    fieldcount++;

                    if(removeId !== undefined) {

                        // This element's options have been removed
                        if(fieldcount.toString() === removeId.toString() ) {
                            dropOptions.splice(dropcounter, 1);
                        }
                    }

                    input = $('<div class=\"previewForm col-md-8\"><select class=\"form-control\" id=\"drop' + dropcounter + '\">  </select> <button class=\"btn btn-default\" type=\"button\" onclick=\"insertOption(' + dropcounter +')\">Insert option</button> <button class=\"btn btn-default btn-danger\" type=\"button\" onclick=\"removeOption(' + dropcounter + ')\">Remove option</button></div>');
                    break;
            }

            fieldSet.append(label);
            fieldSet.append(input);
        });

        $('body').append(fieldSet);

        // Add options to dropdown fields
        for (i = 1; i <= dropcounter; i++) {
            if(dropOptions[i] !== undefined) {
                for (j = 0; j < dropOptions[i].length; j++) {
                    x = document.getElementById('drop' + i.toString());
                    x.add(dropOptions[i][j]);
                }
            }
        }

        $('#formContent').append(fieldSet);
    }

    // Add form creation buttons
    $('#add').click(function () {
        addField();
    });

    // Create JSON object and post to database
    $('#submit').click(function() {
        var json = {
            business: findID,
            fields: [
            ]
        };
        var counter = 0;
        var newForm = $('fieldset');

        // Cycle through each preview form field
        newForm.children().each(function(){

            // Check field type and insert appropriate fields
            if ($(this).find('select.fieldtype').first().val()) {
                if ($(this).find('select.fieldtype').first().val() === 'dropdown') {
                    var fieldname = $(this).find('input.fieldname').first().val();
                    var dropJson = {
                        type: 'dropdown',
                        label: fieldname,
                        options: []
                    };

                    counter ++;
                    var options = $('#drop' + counter + ' option');

                    $.map(options ,function(option) {
                        dropJson.options.push(option.value);
                    });

                    json.fields.push(dropJson);
                }
                else {
                    json.fields.push({type: 'textfield', label: $(this).find('input.fieldname').first().val()});
                }
            }
        });

        // If form exists, PUT to database
        if(flag) {
            $.ajax({
                url:'/api/form',
                type:'PUT',
                data: JSON.stringify(json),
                contentType:'application/json',
                dataType:'json',
                success:function(){
                    alert('Form Updated!');
                }
            });
        }

        // POST to database
        else {
            $.ajax({
                url:'/api/form',
                type:'POST',
                data: JSON.stringify(json),
                contentType:'application/json',
                dataType:'json',
                success:function(){
                    alert('Form Submitted!');
                }
            });

        }

    });

    // Gets form from database and creates fields
    function makeForm(form) {
        flag = true;
        var body = {};
        var formHtml = '<form class="form-horizontal" method="post" action="#" enctype="application/x-www-form-urlencoded">';
        _.each(form.fields, function (field, index) {
            formHtml += makeFormGroup(field, index, body);
        });

        formHtml += '</form>';
    }

    // Called by makeForm, creates appropriate text/drop fields
    function makeFormGroup(field, index, body) {
        var name = '_' + index;

        var s = '<div class="form-group">';
        s += '<label for="' + name + '" class="col-md-2 control-label">' + field.label + '</label>';

        s += '<div class="col-md-10">';
        if (field.type === 'textfield') {
            s += makeTextfield(name, body);
            addField(field.label, field.type);
        } else if (field.type === 'dropdown') {
            dropCounter++;
            s += makeDropdown(field.options, name, body);
            addField(field.label, field.type);
        }
        s += '</div>';

        s += '</div>';
        return s;
    }

    // Creates dropdown field from database form
    function makeDropdown(options, name, body) {
        var s = '<select class="form-control" name="'+ name +'" id="'+ name +'">';
        _.each(options, function (option) {
            var optionText = document.createElement('option');

            if(! dropOptions[dropCounter]) {
                dropOptions[dropCounter] = [];
            }

            optionText.text = option;
            dropOptions[dropCounter].push(optionText);

            s += '<option value="'+option+'" ' + (body[name] === option ? 'selected' : '') + '>'+option+'</option> ';
        });

        s+= '</select>';
        return s;
    }

    // Creates text field from database form
    function makeTextfield(name, body) {

        return'<input type="text" class="form-control" name="'+name+'" id="' + name + '"value="' + (body[name] || '') + '">';
    }
});
