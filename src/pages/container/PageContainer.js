
import "./PageContainer.css"
import { Button, Input, Spin, DatePicker, Popconfirm, Space, Select } from "antd"
import { isEmptyOrNull } from "../../config/service"

const PageContainer = ({
    pageTitle = "PageTitle",
    loading = false,
    btnRight = false,
    btnFilter = false,
    btnStatus = false,
    btntpriority = false,
    onClickBtnRight,
    children,
    onChangeDate,
    onFilterDate,
    onConfirm,
    onchangeStatus,
    priority,
    onchangePriority,
    search = {
        title: "Name",
        size: "middle",
        allowClear: true
    },
    onSearch
}) => {
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <div>
            {/* header */}
            <div className="pageHeaderContainer">
                <div className="rowHeader">
                    <div className="pageTitle">{pageTitle}</div>

                    {search != null &&
                        <div className="filterContent">
                            <Input.Search
                                placeholder={search.title}
                                size={search.size}
                                onSearch={onSearch}
                                allowClear={search.allowClear}
                            />
                        </div>}
                    <div>
                        <Space>

                        {!isEmptyOrNull(btntpriority) &&
                                <Select
                                    showSearch
                                    placeholder="Select a Priority"
                                    optionFilterProp="children"
                                    filterOption={filterOption}
                                    allowClear={true}
                                    onChange={onchangePriority}
                                    style={{
                                        width: 150,
                                    }}
                                    options={priority} />
                            }

                            {!isEmptyOrNull(btnFilter) &&
                                <DatePicker allowClear={true} onChange={onChangeDate} picker="month" />
                            }

                            {!isEmptyOrNull(btnStatus) &&
                                <Select
                                    showSearch
                                    placeholder="Select a status"
                                    optionFilterProp="children"
                                    filterOption={filterOption}
                                    allowClear={true}
                                    onChange={onchangeStatus}
                                    style={{
                                        width: 150,
                                    }}
                                    options={[
                                        {
                                            value: '1',
                                            label: 'Not Started',
                                        },
                                        {
                                            value: '2',
                                            label: 'In Progress',
                                        },
                                        {
                                            value: '3',
                                            label: 'Completed',
                                        },
                                    ]} />
                            }

                            {!isEmptyOrNull(btnFilter) &&
                                <Popconfirm
                                    title="Download the Report"
                                    description="Are you sure to Download this Report?"
                                    onConfirm={onConfirm}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button>Download</Button>
                                </Popconfirm>
                            }




                        </Space>
                    </div>
                </div>
                <div>
                    {!isEmptyOrNull(btnRight) &&
                        <Button type="primary" onClick={onClickBtnRight}>{btnRight}</Button>
                    }
                </div>
            </div>
            {/* body */}
            <Spin spinning={loading}>
                {children}
            </Spin>
        </div>
    )
}

export default PageContainer