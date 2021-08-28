"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function _defineProperties(t,e){for(var s=0;s<e.length;s++){var i=e[s];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}function _createClass(t,e,s){return e&&_defineProperties(t.prototype,e),s&&_defineProperties(t,s),t}var ClassNotes=function(){function e(t){_classCallCheck(this,e),this.textArea=$("#courseNotebook-text"),this.content=$(".class-notes"),this.$task=$(".task"),this.$saveButton=$(".class-notes-save-button"),this.$savedText=$(".class-notes-saved-text"),this.$limitText=$(".class-notes-limit-text"),this.endpoint="/course/note/".concat(this.$task.data("course-code")),this.originalText=this.textArea.val(),this._isSaving=!1,t||this.fetchNote()}return _createClass(e,[{key:"saveNotes",value:function(){var e,s=this;this.textArea.val()==this.originalText||this._isSaving||(this.$saveButton.parent().addClass("class-notes-save-button--saving"),this.$saveButton.get(0).innerHTML=this.$saveButton.data("savingText"),this._isSaving=!0,e=setTimeout(function(){return s._isSaving=!1},700),$.post(this.endpoint,{text:this.textArea.val()}).done(function(){s.$saveButton.parent().removeClass("class-notes-save-button--saving"),s.$saveButton.get(0).innerHTML=s.$saveButton.data("saveText"),s.$savedText.toggle(),setTimeout(function(){return s.toggleSaveText()},1200),s.originalText=s.textArea.val(),s._isSaving=!1,clearTimeout(e)}).fail(function(t){s.$limitText.text(t.responseText),s.$limitText.toggle(),setTimeout(function(){return s.toggleLimitText()},3e3),s.$saveButton.parent().removeClass("class-notes-save-button--saving"),s.$saveButton.get(0).innerHTML=s.$saveButton.data("saveText"),s._isSaving=!1,clearTimeout(e)}))}},{key:"toggleSaveText",value:function(){var t=this.$savedText.attr("aria-hidden");this.$savedText.attr("aria-hidden",!t),this.$savedText.toggle()}},{key:"toggleLimitText",value:function(){var t=this.$limitText.attr("aria-hidden");this.$limitText.attr("aria-hidden",!t),this.$limitText.toggle()}},{key:"debounce",value:function(s){return function(){var t=this,e=arguments;clearTimeout(this.timeout),this.timeout=setTimeout(function(){s.apply(t,e)},300)}.bind(this)}},{key:"fetchNote",value:function(){var e=this;$.get(this.endpoint).done(function(t){t&&(e.originalText=t.text.raw,e.textArea.val(e.originalText))})}},{key:"refreshListeners",value:function(){var t=this;this.textArea.get(0)&&(this.textArea.on("change",this.debounce(this.saveNotes)),window.onunload=function(){return t.saveNotes()},$(".class-notes-close-button").on("click",function(){return t.toggleContent()}),$(".class-notes-button").on("click",function(){return t.toggleContent()}),this.$saveButton.on("click",function(){return t.saveNotes()}))}},{key:"_setCookie",value:function(t){var e=new Date,s=6048e5*(t?1:-1);e.setTime(e.getTime()+s);e="expires="+e.toUTCString();document.cookie="openCourseNote="+t+";"+e+";path=/"}},{key:"toggleContent",value:function(){this.$task.toggleClass("class-notes--active");var t=this.$task.hasClass("class-notes--active");t||this.saveNotes(),this._setCookie(t)}}]),e}();