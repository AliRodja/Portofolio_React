function FieldLabel({ htmlFor, required, children }) {
    return (
        <label className="block text-sm font-medium text-slate-600 mb-2" htmlFor={htmlFor}>
            {children}
            {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
    );
}

export default FieldLabel;
