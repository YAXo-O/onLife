import useProfiledData from './useProfiledData'
import { useDispatch } from 'react-redux'
import { getTrainingPrograms, setCurrentTrainingProgram } from '../redux/action-creators';

export default function () {
  const dispatch = useDispatch();
  const programs = useProfiledData('training.programs');
  const currentProgram = useProfiledData('training.currentProgram');

  if (typeof programs === 'undefined') {
    dispatch(getTrainingPrograms());
    return undefined;
  }

  if (currentProgram) {
    const program = programs.find((program) => program.id == currentProgram);
    if (program) {
      return program;
    }
  }

  if (programs && programs.length) {
    const program = programs[0];
    dispatch(setCurrentTrainingProgram(program.id, null));
    return program;
  }

  return null;
}
