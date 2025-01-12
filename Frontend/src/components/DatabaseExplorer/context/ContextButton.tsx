import React from 'react';
import { Button, Tooltip } from 'antd';
import { FileTextOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useContextProvider } from './ContextProvider';
import { EntityType } from '@/lib/api/types';

interface ContextButtonProps {
    type: EntityType;
    name: string;
    parentName?: string;
    hasContext?: boolean;
    size?: 'small' | 'middle' | 'large';
    className?: string;
    onClick?: () => void;  // Add this line
}

export const ContextButton: React.FC<ContextButtonProps> = ({
    type,
    name,
    parentName,
    hasContext = false,
    size = 'middle',
    className = '',
    onClick
}) => {
    const { loading, openEditor } = useContextProvider();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick();
        openEditor(type, name, parentName);
    };

    const getTooltipText = () => {
        if (loading) return 'Loading context...';
        return hasContext ? 'Edit context' : 'Add context';
    };

    return (
        <Tooltip title={getTooltipText()}>
            <Button
                type="text"
                size={size}
                className={className}
                onClick={handleClick}
                disabled={loading}
                icon={loading ? <LoadingOutlined /> : hasContext ? <FileTextOutlined /> : <PlusOutlined />}
            />
        </Tooltip>
    );
};

// Compound components for specific entity types
export const DatabaseContextButton: React.FC<Omit<ContextButtonProps, 'type'>> = (props) => (
    <ContextButton {...props} type="database" />
);

export const TableContextButton: React.FC<Omit<ContextButtonProps, 'type'>> = (props) => (
    <ContextButton {...props} type="table" />
);

export const ColumnContextButton: React.FC<Omit<ContextButtonProps, 'type'>> = (props) => (
    <ContextButton {...props} type="column" />
);