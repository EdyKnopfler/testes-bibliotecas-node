import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TAPi18n } from 'meteor/tap:i18n';

import './main.html';

Template.template_i18n.helpers({
    english: function() {
      return TAPi18n.getLanguage() == 'en';
    },
    portuguese: function() {
      return TAPi18n.getLanguage() == 'pt';    
    }
});

Template.template_i18n.events({
  'change #language'(event, instance) {
    TAPi18n.setLanguage($('#language').val());
  },
});
