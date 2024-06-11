import {
  Component,
  h,
  Prop,
  Element,
  State,
  Listen,
  Watch,
  Host,
  Method,
} from '@stencil/core';
import { ModusTableCellValueChange } from '../models/modus-table.models';
import { ModusTableCell } from './cell/modus-table-cell';
import { ModusTableCellCheckbox } from './row/selection/modus-table-cell-checkbox';
import { COLUMN_DEF_SUB_ROWS_KEY } from '../modus-table.constants';
import { TableContext } from '../models/table-context.models';
import { Virtualizer } from '@tanstack/virtual-core';
import { VirtualizerOptions } from '@tanstack/virtual-core';
@Component({
  tag: 'modus-table-body',
})
export class ModusTableBody {
  @Prop() context: TableContext;
  @Element() el: HTMLModusTableBodyElement;

  @State() rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>;
  private tableContainer: HTMLDivElement;
  
  componentDidLoad() {
    const virtualizerOptions: VirtualizerOptions<HTMLDivElement, HTMLTableRowElement> = {
      count: this.context.tableInstance.getRowModel().rows.length,
      getScrollElement: () => this.tableContainer,
      estimateSize: () => 35, // Adjust based on your row height
      scrollToFn: (offset) => {
      },
      observeElementRect: (element, callback) => {
        return () => {
        };
      },
      observeElementOffset: (element, callback) => {
       
        return () => {
        };
      },
    };

    this.rowVirtualizer = new Virtualizer(virtualizerOptions);
  }

  handleCellValueChange(props: ModusTableCellValueChange) {
    const { row, accessorKey, newValue } = props;
    this.context.updateData(
      (old: unknown[]) => {
        const newData = [...old];

        const idArray: number[] = [];
        let currentRow = row;
        while (currentRow) {
          idArray.push(currentRow['index']);
          currentRow = currentRow['parent'];
        }
        idArray.reverse();

        if (idArray.length === 1) {
          newData[idArray[0]][accessorKey] = newValue;
        } else if (idArray.length === 2) {
          newData[idArray[0]][COLUMN_DEF_SUB_ROWS_KEY][idArray[1]][accessorKey] = newValue;
        } else if (idArray.length === 3) {
          newData[idArray[0]][COLUMN_DEF_SUB_ROWS_KEY][idArray[1]][COLUMN_DEF_SUB_ROWS_KEY][idArray[2]][accessorKey] =
            newValue;
        }

        return newData;
      },
      { ...props, row: row['original'] }
    );
  }

  render() {
    const { density, hover, rowSelection, rowSelectionOptions, rowActions, tableInstance: table } = this.context;
    const hasRowActions = rowActions?.length > 0;
    const multipleRowSelection = rowSelectionOptions?.multiple;
    let checkboxSize: 'medium' | 'small' = 'medium';
    if (density === 'compact') {
      checkboxSize = 'small';
    }

    console.log('this.context', this.context);

    return (
      <Host>
        <div
          ref={(el) => (this.tableContainer = el)}
          style={{ overflow: 'auto', height: '800px', position: 'relative' }}
        >
          <tbody
            style={{
              display: 'grid',
              height: `${this.rowVirtualizer?.getTotalSize()}px`,
              position: 'relative',
            }}
          >
            {this.rowVirtualizer?.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              const { getIsSelected, getIsAllSubRowsSelected, getVisibleCells, subRows, id } = row;
              const isChecked = getIsSelected() && (subRows?.length ? getIsAllSubRowsSelected() : true);

              return (
                <tr
                  key={id}
                  class={{ 'enable-hover': hover, 'row-selected': isChecked }}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`,
                    width: '100%',
                  }}
                >
                  {rowSelection && (
                    <ModusTableCellCheckbox
                      multipleRowSelection={multipleRowSelection}
                      row={row}
                      isChecked={isChecked}
                      checkboxSize={checkboxSize}
                    ></ModusTableCellCheckbox>
                  )}
                  {getVisibleCells()?.map((cell, cellIndex) => (
                    <ModusTableCell
                      // key={cell.id}
                      cell={cell}
                      cellIndex={cellIndex}
                      context={this.context}
                      // valueChange={(props) => this.handleCellValueChange(props)}
                      valueChange={this.handleCellValueChange}

                    />
                  ))}
                  {hasRowActions && (
                    <td class="sticky-right" tabindex="0">
                      {/* <modus-table-row-actions row={row} context={context} /> */}
                      <modus-table-row-actions-cell row={row} context={this.context} />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </div>
      </Host>
    );
  }
}
