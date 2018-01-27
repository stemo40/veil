==========
Background
========== 

The jQuery Veil plugin was developed as an alternative to other modal window plugins, and as an update to the reveal plugin that has been deprecated. jQuery Veil has updated the basic concept and added some new features.

.. NOTE:: New features list:
1. Set the Height of the dialog
2. Set the Width of the dialog
3. Set the source of the optional iframe
4. Set the top position of the dialog
5. Set the left position of the dialog
6. New 'slide' animation
7. New frosted glass background
8. New blurred background

See the example file for more info.

===============
Getting Started
===============

To begin, you need to ensure that the stylesheets and the javascript libraries are included in your html file.

Required Libraries
==================

Include the required javascript libraries::

 <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
 <script src="js/jquery.veil.js"></script>

Define the modal
================

Provide the html code for the modal window::

 <div id="modal" class="veil-modal-container">
		<img src="img/washington.jpg"/>
		<div class="veil-footer">
		<input type="button" value="Close" class="btn btn-default veil-close"/>
    </div>
 </div>

