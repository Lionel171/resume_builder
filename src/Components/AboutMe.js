import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { EditorState, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Draggable from "react-draggable";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckIcon from "@material-ui/icons/Check";
import CancelIcon from "@material-ui/icons/Cancel";

export const AboutMe = ({ label, description }) => {
  const [selectedText, setSelectedText] = useState(false);
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(description))
  );
  const [currentDescription, setCurrentDescription] = useState(description);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [previousPosition, setPreviousPosition] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleTextSelection = () => {
    setSelectedText(true);
  };

  const handleDescriptionChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSaveDescription = () => {
    // Save the edited description
    const data = editorState.getCurrentContent().getPlainText();
    console.log("Saved:", data);
    setSelectedText(false); // Reset text selection
    setIsEditing(false); // Reset editing state
    setCurrentDescription(data);
  };

  const handleCancelEdit = () => {
    setEditorState(
      EditorState.createWithContent(ContentState.createFromText(currentDescription))
    );
    setSelectedText(false); // Reset text selection
    setIsEditing(false); // Reset editing state
  };

  const handleDragStart = () => {
    if (!isEditing) {
      setSelectedText(true);
      setPreviousPosition(position); // Store the previous position
    }
  };

  const handleDragStop = (_event, { x, y }) => {
    if (!isEditing) {
      setPosition({ x, y });
      setPreviousPosition({ x, y }); // Update previous position while dragging
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDeleteComponent = () => { };

  const handleApply = () => {
    setSelectedText(false);
    setIsLocked(true); // Lock the description in place
  };
  const handleCancelMove = () => {
    if (!isLocked) {
      setPosition(previousPosition); // Reset position to previous value
    }
    setSelectedText(false);
  };


  const toolbarOptions = {
    options: [
      "inline",
      "blockType",
      "list",
      "textAlign",
      "colorPicker",
      "fontSize",
      "fontFamily",
      // "link",
    ],
  };

  return (
    <section className="profile section" id="profile">
      <h2 className="section-title">{label}</h2>
      <Draggable
        disabled={isEditing}
        position={position}
        onStart={handleDragStart}
        onStop={handleDragStop}
      >
        <div className={`profile__description ${selectedText ? "selected" : ""}`}>
          {selectedText ? (
            <>
              {isEditing ? (
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleDescriptionChange}
                  toolbar={toolbarOptions}
                />
              ) : (
                <div>
                  <Editor editorState={editorState} toolbarHidden={true} readOnly={true} />
                  <div className="edit-buttons">
                    {!isEditing && (
                      <>
                        <Button onClick={handleEdit} variant="outlined" color="primary" size="small">
                          <EditIcon />
                        </Button>{" "}
                        <Button
                          onClick={handleDeleteComponent}
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          <DeleteIcon />
                        </Button>{" "}
                        <Button onClick={handleApply} variant="outlined" color="default" size="small">
                          <CheckIcon />
                        </Button>{" "}
                        <Button
                          onClick={handleCancelMove}
                          variant="outlined"
                          color="secondary"
                          size="small"
                        >
                          <CancelIcon />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div onClick={handleTextSelection}>
              <Editor editorState={editorState} toolbarHidden={true} readOnly={true} />
            </div>
          )}
        </div>
      </Draggable>

      {selectedText && isEditing ? (
        <div className="edit-buttons">
          <Button onClick={handleSaveDescription} variant="contained" color="primary">
            <CheckIcon /> Save
          </Button>{" "}
          <Button onClick={handleCancelEdit} variant="outlined" color="secondary">
            <CancelIcon /> Cancel
          </Button>
        </div>
      ) : null}
    </section>
  );
};