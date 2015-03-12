// Script to add, remove, preview and submit form elements

// Insert options into appropriate dropdown field
function insertOption(dropcounter) {
    var x = document.getElementById('drop' + dropcounter);
    var option = document.createElement('option');
    option.text = prompt ('Name your option');

    //checks for null
    if (option.text === 'null'){
      return;
    }

    //checks for input
    if (option.text)
    {
       x.add(option);
    }

}

// Remove option from appropriate dropdown field
function removeOption(dropcounter) {
    var x = document.getElementById('drop' + dropcounter);
    x.remove(x.selectedIndex);
}

$(document).ready(function () {

    function preview() {
        var dropCounter = 0;
        $('#yourform').remove();

        var fieldSet = $('<fieldset id=\"yourform\"><legend>Your Form</legend></fieldset>');

        // Iterate through each field and append its HTML to the preview form
        $('#buildyourform div').each(function () {
            var id = 'input' + $(this).attr('id').replace('field', '');
            var label = $('<label class=\"col-md-4\" for=\"' + id + '\">' + $(this).find('input.fieldname').first().val() + '</label>');
            var input;

            switch ($(this).find('select.fieldtype').first().val()) {
                case 'textbox':
                    input = $('<div class=\"previewForm col-md-8\"><input class=\"form-control\" type=\"text\" id=\"' + id + '\" name=\"' + id + '\" /></div>');
                    break;
                case 'dropdown':
                    dropCounter ++;
                    input = $('<div class=\"previewForm col-md-8\"><select class=\"form-control\" id=\"drop' + dropCounter + '\">  </select> <button class=\"btn btn-default\" type=\"button\" onclick=\"insertOption(' + dropCounter +')\">Insert option</button> <button class=\"btn btn-default btn-danger\" type=\"button\" onclick=\"removeOption(' + dropCounter + ')\">Remove option</button></div>');
                    break;
            }
            fieldSet.append(label);
            fieldSet.append(input);
        });
        $('#formContent').append(fieldSet);
    }

    // Add form creation buttons
    $('#add').click(function () {
        var intId = $('#buildyourform div').length + 1;
        var fieldWrapper = $('<div class=\"builderForm fieldwrapper form-group\" id=\"field' + intId + '\"/>');
        var fName = $('<input type=\"text\" class=\"fieldname form-control col-xs-4\" placeholder=\"Field Title\" />');
        var fType = $('<select class=\"fieldtype form-control col-xs-3\"><option value=\"textbox\">Text</option><option value=\"dropdown\">Drop</option> </select>');

        var removeButton = $('<button type="button" class="remove btn btn-default btn-danger col-xs-1s" aria-label="Left Align"><span class="glyphicon glyphicon-remove white" aria-hidden="true"></span></button>');
        removeButton.click(function () {
            $(this).parent().remove();
        });
        fieldWrapper.append(fName);
        fieldWrapper.append(fType);
        fieldWrapper.append(removeButton);
        $('#buildyourform').append(fieldWrapper);

        fType.change(function() {
            preview();
        });

        fName.on('input', function() {
            preview();
        });

        preview();
    });

    // Create JSON object and post to database
    $('#submit').click(function() {
        var json = {
            business: 'temp',
            fields: [
            ]
        };
        var dropCounter = 0;
        var form = $('fieldset');

        // Cycle through each preview form field
        form.children().each(function(){

            // Check field type and insert appropriate fields
            if ($(this).find('select.fieldtype').first().val()) {
                if ($(this).find('select.fieldtype').first().val() === 'dropdown') {
                    var fieldname = $(this).find('input.fieldname').first().val();
                    var dropJson = {
                        type: 'dropdown',
                        label: fieldname,
                        options: []
                    };

                    dropCounter ++;
                    var options = $('#drop' + dropCounter + ' option');

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

        $.ajax({
            url:'/api/m/form',
            type:'POST',
            data: JSON.stringify(json),
            contentType:'application/json',
            dataType:'json',
            success:function(){}
        });
    });
});
