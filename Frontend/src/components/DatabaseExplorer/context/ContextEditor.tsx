import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Alert, Spin } from 'antd';
import { useContextProvider } from './ContextProvider';

interface EditorFields {
    description: string;
    businessContext: string;
    technicalNotes: string;
    [key: string]: string;
}

export const ContextEditor: React.FC = () => {
    const { state, loading, error, closeEditor, getContext, updateContext } = useContextProvider();
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchContext = async () => {
            if (state.selectedEntity && state.isEditorOpen) {
                try {
                    const params = {
                        dbName: state.selectedEntity.parentName?.split('.')[0] || state.selectedEntity.name,
                        tableName: state.selectedEntity.type === 'column' 
                            ? state.selectedEntity.parentName?.split('.')[1]
                            : state.selectedEntity.type === 'table' 
                                ? state.selectedEntity.name 
                                : undefined,
                        columnName: state.selectedEntity.type === 'column' ? state.selectedEntity.name : undefined
                    };

                    const contextData = await getContext(state.selectedEntity.type, params);
                    if (contextData) {
                        form.setFieldsValue({
                            description: contextData.description || '',
                            businessContext: contextData.businessContext || '',
                            technicalNotes: contextData.technicalNotes || '',
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch context:', err);
                }
            }
        };

        fetchContext();
    }, [state.selectedEntity, state.isEditorOpen, getContext, form]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (!state.selectedEntity) return;

            setIsSaving(true);
            const params = {
                dbName: state.selectedEntity.parentName?.split('.')[0] || state.selectedEntity.name,
                tableName: state.selectedEntity.type === 'column' 
                    ? state.selectedEntity.parentName?.split('.')[1]
                    : state.selectedEntity.type === 'table' 
                        ? state.selectedEntity.name 
                        : undefined,
                columnName: state.selectedEntity.type === 'column' ? state.selectedEntity.name : undefined
            };

            await updateContext(state.selectedEntity.type, params, values);
            closeEditor();
        } catch (err) {
            console.error('Failed to update context:', err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!state.isEditorOpen || !state.selectedEntity) return null;

    return (
        <Modal
            title={`Edit Context: ${state.selectedEntity.type} - ${state.selectedEntity.name}`}
            open={state.isEditorOpen}
            onOk={handleSave}
            onCancel={closeEditor}
            confirmLoading={isSaving}
            width={600}
        >
            <Spin spinning={loading}>
                {error && (
                    <Alert
                        message="Error"
                        description={error.message}
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                )}

                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea
                            placeholder="Provide a general description..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="businessContext"
                        label="Business Context"
                    >
                        <Input.TextArea
                            placeholder="Explain business relevance and usage..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="technicalNotes"
                        label="Technical Notes"
                    >
                        <Input.TextArea
                            placeholder="Add technical details, constraints, relationships..."
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};