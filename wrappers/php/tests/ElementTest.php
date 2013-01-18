<?php

require_once 'PHPUnit/Autoload.php';
require_once 'lib/kendo/html/Element.php';

class ElementTest extends PHPUnit_Framework_TestCase {

    private $element;

    protected function setUp() {
        $this->element = new \kendo\html\Element('div');
    }

    public function testOuterHtmlReturnsTheHtmlContentsOfTheElement() {
        $this->assertEquals('<div></div>', $this->element->outerHtml());
    }

    public function testSelfClosingElementsDoNotEmitClosingTag() {
        $element = new kendo\html\Element('img', true);

        $this->assertEquals('<img />', $element->outerHtml());
    }

    public function testAppendReturnsSelf() {
        $this->assertEquals($this->element, $this->element->append(new kendo\html\Element('span')));
    }

    public function testOuterHtmlIncludesTheChildren() {
        $child = new kendo\html\Element('span');

        $this->element->append($child);

        $this->assertEquals('<div><span></span></div>', $this->element->outerHtml());
    }

    public function testTextSetsTheTextContentOfTheElement() {
        $this->element->text('foo');

        $this->assertEquals('<div>foo</div>', $this->element->outerHtml());
    }

    public function testTextReturnsSelf() {
        $this->assertEquals($this->element, $this->element->text('foo'));
    }

    public function testTextOverridesChildren(){
        $this->element->append(new kendo\html\Element('span'));

        $this->element->text('foo');

        $this->assertEquals('<div>foo</div>', $this->element->outerHtml());
    }

    public function testTextEncodesEntities() {
        $this->element->text('<a>&');

        $this->assertEquals('<div>&lt;a&gt;&amp;</div>', $this->element->outerHtml());
    }
}
