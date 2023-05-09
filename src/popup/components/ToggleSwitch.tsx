import './ToggleSwitch.scss';

interface Props {
  id: string;
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<Props> = ({ id, isChecked, onChange, label }) => {
  const handleToggle = () => {
    onChange(!isChecked);
  };

  return (
    <div className='toggle-switch-container'>
      <label className='toggle-switch' htmlFor={id}>
        <input type='checkbox' id={id} checked={isChecked} onChange={handleToggle} />
        <span className='toggle-slider'></span>
      </label>
      {label && <span className='toggle-switch-label'>{label}</span>}
    </div>
  );
};

export default ToggleSwitch;
