import {window, Position, Range} from 'vscode';

export class Motion {

    isCharacterUpdated = true;

    private lineDelta = 0;
    private characterDelta = 0;

    protected translate(lineDelta: number, characterDelta: number): void {
        this.lineDelta += lineDelta;
        this.characterDelta += characterDelta;
    }

    apply(from: Position, option?): Position {
        const activeTextEditor = window.activeTextEditor;

        if (! activeTextEditor) {
            return from;
        }

        const document = activeTextEditor.document;

        let toLine = from.line + this.lineDelta;
        let toCharacter = from.character + this.characterDelta;

        if (toLine < 0) {
            toLine = 0;
            toCharacter = 0;
        }
        else if (toLine > document.lineCount - 1) {
            toLine = document.lineCount - 1;
            toCharacter = Infinity;
        }

        if (from.line !== toLine) {
            const fromLineTabCount = document.getText(new Range(
                from.line, 0,
                from.line, from.character
            )).split("\t").length - 1;

            const toVisibleColumn = toCharacter + fromLineTabCount * (activeTextEditor.options.tabSize - 1);
            const toLineText = document.lineAt(toLine).text;

            let lastVisibleColumn = -1;
            let thisVisibleColumn = 0;
            let i: number;

            for (i = 0; i < toLineText.length && thisVisibleColumn <= toVisibleColumn; i++) {
                lastVisibleColumn = thisVisibleColumn;
                thisVisibleColumn += (toLineText.charAt(i) === "\t") ? activeTextEditor.options.tabSize : 1;
            }

            // Choose the closest
            thisVisibleColumn = Math.abs(toVisibleColumn - thisVisibleColumn);
            lastVisibleColumn = Math.abs(toVisibleColumn - lastVisibleColumn);

            if (thisVisibleColumn < lastVisibleColumn) {
                toCharacter = i;
            } else {
                toCharacter = i - 1;
            }
        }

        toCharacter = Math.max(toCharacter, 0);

        return activeTextEditor.document.validatePosition(new Position(toLine, toCharacter));
    }

}
