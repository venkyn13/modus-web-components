import {
  FunctionalComponent,
  h, // eslint-disable-line @typescript-eslint/no-unused-vars
} from '@stencil/core';
import { TableContext } from '../../../models/table-context.models';

interface ModusTableHeaderCheckboxProps {
  context: TableContext;
}

export const ModusTableHeaderCheckbox: FunctionalComponent<ModusTableHeaderCheckboxProps> = ({ context }) => {
  const {
    tableInstance: { getIsAllRowsSelected, getIsSomeRowsSelected, getToggleAllRowsSelectedHandler },
    rowSelectionOptions,
  } = context;
  return (
    <th class="row-checkbox sticky-left" style={{width:'30px'}}>
      {rowSelectionOptions?.multiple && (
        <modus-checkbox
          ariaLabel="Select all rows"
          checked={getIsAllRowsSelected()}
          indeterminate={getIsSomeRowsSelected()}
          onCheckboxClick={getToggleAllRowsSelectedHandler()}></modus-checkbox>
      )}
    </th>
  );
};
