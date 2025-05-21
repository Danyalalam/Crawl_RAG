import { FaTimes, FaRegTrashAlt } from 'react-icons/fa';
import { ChatHeader, Logo, Controls } from './styles';
import hblLogo from '../../assets/hbl-logo.png';

interface ChatHeaderProps {
  onClose: () => void;
  onClear: () => void;
}

const Header: React.FC<ChatHeaderProps> = ({ onClose, onClear }) => {
  return (
    <ChatHeader>
      <Logo>
        <img src={hblLogo} alt="HBL Logo" />
        <h3>HBL Customer Support</h3>
      </Logo>
      <Controls>
        <button onClick={onClear} title="Clear conversation">
          <FaRegTrashAlt />
        </button>
        <button onClick={onClose} title="Close chat">
          <FaTimes />
        </button>
      </Controls>
    </ChatHeader>
  );
};

export default Header;