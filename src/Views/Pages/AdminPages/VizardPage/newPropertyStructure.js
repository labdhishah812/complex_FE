import components from '../..';
import DeleteModal from '../../../../components/DeleteModal';
import ExcelUpload from '../Block/excelUpload';
import toast from 'react-hot-toast';
import { createStructureRequest, createFloorStructureRequest, createShoppingStructureRequest, createShoppingFloorStructureRequest } from '../../../../redux/slice/AdminSlices/blockSlice';
import { alphabet } from '../Block/constant';
