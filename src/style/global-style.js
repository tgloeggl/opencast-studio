import css from '@emotion/css/macro'

const GlobalStyle = css`
* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    min-height: 100%;
}

html, body, button, input {
    font-family: Ubuntu, Roboto, "Open Sans", "Segoe UI", "Helvetica Neue", Verdana, sans-serif;
}

body {
    overflow-x: hidden;
}

label, button:not(:disabled) {
    cursor: pointer;
}

button {
    outline: none;
}

input {
    border: 1px solid #ccc;
    height: 2rem;
    border-radius: 0.125rem;
    padding: 0 0.5rem;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input:focus {
    border-color: #47af7a;
    box-shadow: 0 0 3px #8cf;
}

#root {
  height: 100%;
}
`;

export default GlobalStyle;