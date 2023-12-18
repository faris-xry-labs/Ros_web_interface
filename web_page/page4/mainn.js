let vueApp = new Vue({
    el: "#vueApp",
    data: {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://localhost:9090',
        connected: false,
        jointPosition: 0, // Add this variable for the joint position
        // page content
        menu_title: 'Connection',
        main_title: 'Commond Robot',
    },
    methods: {
        connect: function() {
            // define ROSBridge connection object
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })

            // define callbacks
            this.ros.on('connection', () => {
                this.connected = true
                console.log('Connection to ROSBridge established!')
            })
            this.ros.on('error', (error) => {
                console.log('Something went wrong when trying to connect')
                console.log(error)
            })
            this.ros.on('close', () => {
                this.connected = false
                console.log('Connection to ROSBridge was closed!')
            })
        },
        disconnect: function() {
            this.ros.close()
        },
        publishJoint: function() {
            // Convert jointPosition to a float before publishing
            let jointPositionFloat = parseFloat(this.jointPosition);

            // Check if the conversion was successful
            if (!isNaN(jointPositionFloat)) {
                let topic = new ROSLIB.Topic({
                    ros: this.ros,
                    name: '/arm_controller/command',
                    messageType: 'trajectory_msgs/JointTrajectory'
                });

                let message = new ROSLIB.Message({
                    header: {
                        seq: 0,
                        stamp: { secs: 0, nsecs: 0 },
                        frame_id: ' '
                    },
                    joint_names: ['joint2'],
                    points: [
                        {
                            positions: [jointPositionFloat],
                            velocities: [0],
                            accelerations: [0],
                            effort: [0],
                            time_from_start: { secs: 10, nsecs: 10 }
                        }
                    ]
                });

                topic.publish(message);
                console.log("Command sent to /arm_controller/command");
            } else {
                console.error("Invalid joint position. Please enter a valid number.");
            }
        },
    },
    mounted() {
        // page is ready
        console.log('page is ready!');
    },
});
