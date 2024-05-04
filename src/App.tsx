import './styles.css';

import { MyEditor } from './MyEditor';

export function App() {
    return (
        <div className="App">
            <h1>@prezly/slate-lists - Demo</h1>
            <div className="editor">
                <MyEditor />
            </div>
        </div>
    );
}
