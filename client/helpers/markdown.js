import { Template } from "meteor/templating";
import { Blaze } from "meteor/blaze"

import marked from "marked";
import DOMPurify from 'dompurify';

import hljs from 'highlight.js';
import "highlight.js/styles/github.css";

marked.setOptions({
  gfm: true,
  highlight(code, lang) {
    return `<div class="hljs language-${lang || 'js'}">${code}</div>`;

  },
  sanitizer(code) {
    return DOMPurify.sanitize(code);
  }
});

const markdownTemplate = new Template('markdown', function () {
  const view = this;
  let content = '';
  if (view.templateContentBlock) {
    content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
  }
  return HTML.Raw(marked.parse(content));
});

markdownTemplate.onRendered(function () {
  $('.hljs').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});

Template.registerHelper("markdown", markdownTemplate);
