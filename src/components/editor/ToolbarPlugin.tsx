export const ToolbarPlugin = () => {
    return (
      <div className="toolbar">
        <button className="toolbar-item" title="Bold">
          <i className="format bold">B</i>
        </button>
        <button className="toolbar-item" title="Italic">
          <i className="format italic">I</i>
        </button>
        <button className="toolbar-item" title="Underline">
          <i className="format underline">U</i>
        </button>
        <button className="toolbar-item" title="Code">
          <i className="format code">{`<>`}</i>
        </button>
        <div className="divider" />
        <button className="toolbar-item" title="Heading 1">
          <i className="format h1">H1</i>
        </button>
        <button className="toolbar-item" title="Heading 2">
          <i className="format h2">H2</i>
        </button>
        <button className="toolbar-item" title="Heading 3">
          <i className="format h3">H3</i>
        </button>
        <div className="divider" />
        <button className="toolbar-item" title="Bullet List">
          <i className="format bullet-list">•</i>
        </button>
        <button className="toolbar-item" title="Numbered List">
          <i className="format numbered-list">1.</i>
        </button>
        <div className="divider" />
        <button className="toolbar-item" title="Quote">
          <i className="format quote">"</i>
        </button>
        <button className="toolbar-item" title="Link">
          <i className="format link">🔗</i>
        </button>
      </div>
    );
  };