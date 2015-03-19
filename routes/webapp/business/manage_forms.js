var _ = require('underscore');

function makeDropdown(options, name, body) {
    var s = '<select class="form-control" name="'+name+'" id="'+name+'">';
    _.each(options, function (option) {
        s += '<option value="'+option+'" ' + (body[name] === option ? 'selected' : '') + '>'+option+'</option> ';
    });
    s+= '</select>';
    return s;
}

function makeTextfield(name, body) {
    return'<input type="text" class="form-control form-width-custom" name="'+name+'" id="' + name + '"value="' + (body[name] || '') + '">';
}

function makeFormGroup(field, index, body) {
    var name = '_' + index;

    var s = '<div class="form-group">';
    s += '<label for="' + name + '" class="col-md-4 control-label">' + field.label + '</label>';

    s += '<div class="col-md-8">';
    if (field.type === 'textfield') {
        s += makeTextfield(name, body);
    } else if (field.type === 'dropdown') {
        s += makeDropdown(field.options, name, body);
    }
    s += '</div>';

    s += '</div>';
    return s;
}
/**
 *
 *
 * @param db The MongoDB object
 * @param businessId The id for the business
 * @param body The form body (used to prefill form)
 * @param fn Callback function `fn(formHtml)`
 */
function makeForm(db, businessId, body, fn) {
    var businesses = db.get('businesses');
    var forms = db.get('forms');

    //Find the business and get their form
    businesses.findById(businessId, function (err, business) {
        if (err) {
            return fn(err);
        }
        if (!business) {
            return fn(new Error('Business not found: ' + businessId));
        }
        forms.findOne({business: business._id}, function (err, form) {
            if (err) {
                return fn(err);
            }
            if (!form) {
                return fn(new Error('Form not found for business: ' + businessId));
            }

            var formHtml = '<form class="form-horizontal" action="#">';

            _.each(form.fields, function (field, index) {
                formHtml += makeFormGroup(field, index, body);
            });

            formHtml += '</form>';

            fn(null, formHtml);
        });
    });
}

exports.get = function (req, res, next) {
    makeForm(req.db, req.user[0].business, {}, function (err, formHtml) {
        if (err) {
            return next(err);
        }

        res.render('business/manage_forms',{
            message: req.flash('permission'),
            form: formHtml
        });
    });
};
