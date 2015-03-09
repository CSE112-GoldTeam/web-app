// Script to add, remove, preview and submit form elements

var options = [];
var x;

// Insert options into appropriate dropdown field
function insertOption(dropcounter) {
    var dropdown = document.getElementById('drop' + dropcounter);
    var option = document.createElement('option');
    option.text = prompt ('Name your option');

    if(! options[dropcounter]) {
       options[dropcounter] = [];
    }

    //checks for null
    if (option.text === 'null'){
      return;
    }

    //checks for input
    if (option.text)
    {
       dropdown.add(option);
       options[dropcounter].push(option);
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
            var label = $('<label for=\"' + id + '\">' + $(this).find('input.fieldname').first().val() + '</label>');
            var input;

            switch ($(this).find('select.fieldtype').first().val()) {
                case 'textbox':
                    input = $('<div class=\"previewForm\"><input type=\"text\" id=\"' + id + '\" name=\"' + id + '\" /></div>');
                    break;
                case 'dropdown':
                    dropCounter ++;
                    input = $('<div class=\"previewForm\"><select id=\"drop' + dropCounter + '\">  </select> <button type=\"button\" onclick=\"insertOption(' + dropCounter +')\">Insert option</button> <button type=\"button\" onclick=\"removeOption(' + dropCounter + ')\">Remove option</button></div>');
                    break;
            }
            fieldSet.append(label);
            fieldSet.append(input);
        });

        $('body').append(fieldSet);

        for (i = 1; i <= dropCounter; i++) {
            if(options[i] !== undefined) {
                for (j = 0; j < options[i].length; j++) {
                    x = document.getElementById('drop' + i.toString());
                    x.add(options[i][j]);
                }
            }
        }
    }

    // Add form creation buttons
    $('#add').click(function () {
        var intId = $('#buildyourform div').length + 1;
        var fieldWrapper = $('<div class=\"fieldwrapper\" id=\"field' + intId + '\"/>');
        var fName = $('<input type=\"text\" class=\"fieldname\" />');
        var fType = $('<select class=\"fieldtype\"><option value=\"textbox\">Text</option><option value=\"dropdown\">Drop</option> </select>');

        var removeButton = $('<input type=\"button\" class=\"remove\" value=Remove>');
        removeButton.click(function () {
        var confirmRemove = confirm("Are you sure?");
        if (confirmRemove)
        {
            $(this).parent().remove();
            preview();
        }
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
            success:function(){
                alert("Form Submitted!");
            }
        });
    });
});
