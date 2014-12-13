Template.coupons.helpers({
  errorClass: function () {
    return Session.get('coupons-error') ? 'has-error has-feedback' : '';
  },
  error: function () {
    return Session.get('coupons-error');
  }
});
Template.coupons.events({
  "submit form": function (event) {
    var couponCode = event.target.text.value;

    Meteor.call('useCoupon', couponCode, function (err, result) {
      // Clear form
      if (err)
        Session.set('coupons-error', TAPi18n.__(err.error));
      else
        event.target.text.value = "";
    });

    // Prevent default form submit
    return false;
  }
});
