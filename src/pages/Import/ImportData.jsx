import { useState, useRef } from 'react';
import { useToast } from '../../context/ToastContext';
import './Import.css';

const UploadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

const FileIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

function ImportData() {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [importType, setImportType] = useState('offers');

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        const validTypes = ['.csv', '.xlsx', '.xls'];
        const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

        if (!validTypes.includes(fileExtension)) {
            toast.error('Please upload a CSV or Excel file');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error('File size must be less than 10MB');
            return;
        }

        setFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleImport = async () => {
        if (!file) {
            toast.error('Please select a file to import');
            return;
        }

        setLoading(true);

        try {
            // Simulate import process
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success(`Successfully imported ${importType} from ${file.name}`);
            removeFile();
        } catch (error) {
            toast.error('Import failed. Please check your file and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="import-page">
            <div className="import-header">
                <h1>Import Data</h1>
                <p>Import offers, affiliates, or advertisers from CSV/Excel files</p>
            </div>

            <div className="import-container">
                <div className="import-form-header">
                    <h2>Upload File</h2>
                    <p>Select what type of data you want to import and upload your file</p>
                </div>

                {/* Import Type Selection */}
                <div className="import-section">
                    <h3 className="import-section-title">What would you like to import?</h3>
                    <div className="import-options">
                        <label className="import-option">
                            <input
                                type="radio"
                                name="importType"
                                value="offers"
                                checked={importType === 'offers'}
                                onChange={(e) => setImportType(e.target.value)}
                            />
                            <div className="import-option-label">
                                <strong>Offers</strong>
                                <span>Import offer campaigns</span>
                            </div>
                        </label>
                        <label className="import-option">
                            <input
                                type="radio"
                                name="importType"
                                value="affiliates"
                                checked={importType === 'affiliates'}
                                onChange={(e) => setImportType(e.target.value)}
                            />
                            <div className="import-option-label">
                                <strong>Affiliates</strong>
                                <span>Import affiliate partners</span>
                            </div>
                        </label>
                        <label className="import-option">
                            <input
                                type="radio"
                                name="importType"
                                value="advertisers"
                                checked={importType === 'advertisers'}
                                onChange={(e) => setImportType(e.target.value)}
                            />
                            <div className="import-option-label">
                                <strong>Advertisers</strong>
                                <span>Import advertiser accounts</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* File Upload */}
                <div className="import-section">
                    <h3 className="import-section-title">Upload File</h3>
                    <div
                        className={`import-dropzone ${isDragging ? 'active' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileSelect}
                        />
                        <div className="import-dropzone-icon">
                            <UploadIcon />
                        </div>
                        <h3>Drop your file here or click to browse</h3>
                        <p>Supports CSV, XLS, XLSX files up to 10MB</p>
                        <button type="button" className="btn btn-outline">
                            Select File
                        </button>
                    </div>

                    {file && (
                        <div className="import-file-info">
                            <div className="import-file-icon">
                                <FileIcon />
                            </div>
                            <div className="import-file-details">
                                <div className="import-file-name">{file.name}</div>
                                <div className="import-file-size">{formatFileSize(file.size)}</div>
                            </div>
                            <button className="import-file-remove" onClick={removeFile} title="Remove file">
                                <XIcon />
                            </button>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="import-actions">
                    <button
                        className="btn btn-success"
                        onClick={handleImport}
                        disabled={!file || loading}
                    >
                        {loading ? 'Importing...' : 'Import Data'}
                    </button>
                    <a href="#" className="import-template-link">
                        <DownloadIcon />
                        Download Sample Template
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ImportData;
