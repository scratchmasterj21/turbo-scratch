// Add these action types at the top with other menu actions
const OPEN_CHATBOT_MENU = 'scratch-gui/menus/OPEN_CHATBOT_MENU';
const CLOSE_CHATBOT_MENU = 'scratch-gui/menus/CLOSE_CHATBOT_MENU';

// Add the chatbot menu state to your initial state
const initialState = {
    // ...existing menu states...
    chatbotMenuOpen: false
};

// Add these action creators 
export const openChatbotMenu = () => ({
    type: OPEN_CHATBOT_MENU
});

export const closeChatbotMenu = () => ({
    type: CLOSE_CHATBOT_MENU
});

// Add to your reducer's switch statement
const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        // ...existing cases...
        case OPEN_CHATBOT_MENU:
            return Object.assign({}, state, {
                chatbotMenuOpen: true
            });
        case CLOSE_CHATBOT_MENU:
            return Object.assign({}, state, {
                chatbotMenuOpen: false
            });
        default:
            return state;
    }
};

// Add this selector
export const chatbotMenuOpen = state => state.scratchGui.menus.chatbotMenuOpen;