import React from 'react';
import { Card, Typography, Empty } from 'antd';
import { DatabaseOutlined, TableOutlined, ColumnHeightOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface ContextDisplayProps {
    type: 'database' | 'table' | 'column';
    name: string;
    description?: string;
    businessContext?: string;
    technicalNotes?: string;
    className?: string;
}

export const ContextDisplay: React.FC<ContextDisplayProps> = ({
    type,
    name,
    description,
    businessContext,
    technicalNotes,
    className = ''
}) => {
    const getIcon = () => {
        switch (type) {
            case 'database':
                return <DatabaseOutlined />;
            case 'table':
                return <TableOutlined />;
            case 'column':
                return <ColumnHeightOutlined />;
            default:
                return <InfoCircleOutlined />;
        }
    };

    // If there's no context information, show Empty component
    if (!description && !businessContext && !technicalNotes) {
        return (
            <Card className={className}>
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="No context information available"
                />
            </Card>
        );
    }

    return (
        <Card className={className}>
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {getIcon()}
                <span style={{ textTransform: 'capitalize' }}>{type}</span> Context: {name}
            </Title>
            
            <div style={{ marginTop: 16 }}>
                {description && (
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Description</Text>
                        <div>
                            <Text type="secondary">{description}</Text>
                        </div>
                    </div>
                )}

                {businessContext && (
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Business Context</Text>
                        <div>
                            <Text type="secondary">{businessContext}</Text>
                        </div>
                    </div>
                )}

                {technicalNotes && (
                    <div style={{ marginBottom: 16 }}>
                        <Text strong>Technical Notes</Text>
                        <div>
                            <Text type="secondary" style={{ whiteSpace: 'pre-wrap' }}>
                                {technicalNotes}
                            </Text>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};