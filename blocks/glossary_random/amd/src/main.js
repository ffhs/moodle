
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Javascript to initialise the Recently accessed items block.
 *
 * @module     block_glossary_random/main
 * @package    block_glossary_random
 * @copyright  2020 Adrian Perez, Fernfachhochschule Schweiz (FFHS) <adrian.perez@ffhs.ch>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getEntry} from './repository';
import Templates from 'core/templates';
import {exception as displayException} from 'core/notification';

const selectors = {
    glossaryEntry: '[data-region="randomglossaryentry-content"]',
    refreshButton: '[id="refresh_glossary_button"]',
};

/**
 * Render the block content.
 *
 * @method renderEntry
 * @param {array} entry array containing entry of glossary item.
 * @return {Promise} Resolved with HTML and JS strings
 */
const renderEntry = entry => Templates.renderForPromise('block_glossary_random/view', entry);

/**
 * Reloads the content of the block.
 *
 * @method reloadContent
 * @param {DOMElement} root object of the element to be replaced
 * @returns {Promise}
 */
const reloadContent = function(root) {
    const content = root.querySelector(selectors.glossaryEntry);

    const instanceId = root.dataset.blockinstanceid || null;
    return getEntry(instanceId)
        .then(entry => renderEntry(entry.data))
        .then(({html, js}) => Templates.replaceNodeContents(content, html, js))
        .catch(displayException);
};

/**
 * Event listener for the refresh button.
 *
 * @param {object} root The root element for the overview block
 */
const initEventListeners = root => {
    root.addEventListener('click', e => {
        if (e.target.closest(selectors.refreshButton)) {
            e.preventDefault();
            reloadContent(root);
        }
    });
};

/**
 * Get and show the glossary entry into the block.
 *
 * @param {String} rootSelector A reference to locate the root element.
 */
export const init = rootSelector => {
    const root = document.querySelector(rootSelector);

    // Init event click listener.
    initEventListeners(root);

    const timerInterval = parseInt(root.dataset.reloadtime);
    if (timerInterval) {
        // Start the periodic interval timer.
        setInterval(() => reloadContent(root), timerInterval);
    }
};
