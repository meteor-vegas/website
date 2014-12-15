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

    Router.go('/coupons/' + couponCode);

    // Prevent default form submit
    return false;
  }
});
