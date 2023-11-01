var template={
    "type": "root",
    "name": "发起人",
    "detail": {
        "mode": "or",
        "user": [
            {
                "userId": 555,
                "userName": "ddd"
            }
        ],
        "authority": [
            "djiojw",
            "fewfrefre"
        ]
    },
    "node": {
        "type": "cs",
        "name": "抄送人",
        "detail": {
            "user": [
                {
                    "userId": 555,
                    "userName": "ddd"
                }
            ]
        },
        "node": {
            "type": 'condition',
            "conditions": [
                {
                    "condition": [
                        {
                            "type": "initiator",
                            "params": [
                                {
                                    "symbol": "dept",
                                    "target": "部门1, 部门2"
                                },{
                                    "symbol": "user",
                                    "target": "用户id"
                                },{
                                    "symbol": "role",
                                    "target": "角色id"
                                }
                            ]
                        },{
                            "type": "form",
                            "params": [
                                {
                                    "symbol": "表单id",
                                    "target": "表单值"
                                }
                            ]
                        }
                    ],
                    "node": {
                        "type": "sp",
                        "name": "审批人",
                        "detail": {
                            "user": [
                                {
                                    "userId": 555,
                                    "userName": "ddd"
                                }
                            ]
                        }
                    }
                },
                {
                    "condition": [
                        {},{}
                    ],
                    "node": {
                        "type": "sp",
                        "name": "审批人",
                        "detail": {
                            "user": [
                                {
                                    "userId": 555,
                                    "userName": "ddd"
                                }
                            ]
                        }
                    }
                }
            ]
        }
    }
}


export default template
