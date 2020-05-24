var dss_drawer = {
    
    visualConfig: 
    {
        callSpacing: 55,
        swimlaneSpacing: 250,
        activeLifelineWidth: 10,
        headerHeight: 50,
        headerWidth: 200
    },

    draw : function (dss, _canvas)
    {
        var status =
        {
            canvas : _canvas,
            currentSwimlane: -1,
            currentLine : 0,
            swimlanesIndex : {}
        };

        status.currentSwimlane = this._addSwimlane(":blank", status);
        this._drawActions(dss.actions, status);
       
    },

    _drawActions: function(actions, status)
    {
        var startRow = status.currentLine;
        var currentSwimlane = status.currentSwimlane;
        for (var i = 0; i < actions.length; i++)
        {
            
            var action = actions[i];
            this._drawAction(action, status);
            this._assert(currentSwimlane == status.currentSwimlane, "Swimlane Missmatch");
        }
        var endRow = status.currentLine;
        
    },

    _drawAction: function(action, status)
    {
        if (action.action == "call")
        {
            this._drawCall(action, status);
        }
    },

    _drawCall: function(call, status)
    {
        var targetSwimlane = call.targetSwimlane;
        var callName = call.call;
        var returnName = call.result;
        var actions = call.actions;
        var result = call.result;
        var targetSwimlaneIndex = 0;
        var startLine = status.currentLine;
        if (status.swimlanesIndex[targetSwimlane] == undefined)
        {
            targetSwimlaneIndex = this._addSwimlane(targetSwimlane, status);
        }
        else
        {
            targetSwimlaneIndex = status.swimlanesIndex[targetSwimlane];
        }
        var sourceSwimlaneIndex = status.currentSwimlane;

        var source = this._swimLanePos(sourceSwimlaneIndex, status.currentLine);
        var destination = this._swimLanePos(targetSwimlaneIndex, status.currentLine);

        var direction = 1;
        if (source.x > destination.x)
        {
            direction = -1;
        }
        source.x += this.visualConfig.activeLifelineWidth/2 * direction;
        destination.x -= this.visualConfig.activeLifelineWidth/2 * direction;

        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute("x1",source.x); 
        line.setAttribute("y1",source.y); 
        line.setAttribute("x2",destination.x - this.visualConfig.activeLifelineWidth/2); 
        line.setAttribute("y2",destination.y); 
        line.setAttribute("class","dss-call");
        status.canvas.appendChild(line);

        var arrowWidth = 20;
        var arrowHeight = 10;
        
        {
        var arrowHead = document.createElementNS("http://www.w3.org/2000/svg", 'polygon');
        var points =    (destination.x - arrowWidth * direction) + " " + (destination.y - arrowHeight/2 * direction) 
                        + ", " + (destination.x) + " " + (destination.y) 
                        + ", " + (destination.x - arrowWidth * direction) + " " + (destination.y + arrowHeight/2 * direction) 
        arrowHead.setAttribute("points",points); 
        arrowHead.setAttribute("class","dss-call");
        status.canvas.appendChild(arrowHead);
        }
        
        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
        text.setAttribute("class","dss-call");
        text.setAttribute("x",source.x + 22 * direction); 
        text.setAttribute("y",source.y - 6); 
        text.setAttribute("dominant-baseline", "baseline");
        if (direction > 0)
        {
            text.setAttribute("text-anchor", "start");
        }
        else
        {
            text.setAttribute("text-anchor", "end");
        }
        text.innerHTML = callName;
        status.canvas.appendChild(text);

        var endLine = status.currentLine;
        if (actions == null)
        {
            var arrowHead2 = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
            var points =    (source.x + arrowWidth * direction) + " " + (source.y - arrowHeight/2 * direction) 
            + ", " + (source.x) + " " + (source.y) 
            + ", " + (source.x + arrowWidth * direction) + " " + (source.y + arrowHeight/2 * direction) 
            arrowHead2.setAttribute("points",points); 
            arrowHead2.setAttribute("class","dss-call");
            status.canvas.appendChild(arrowHead2);
            
            if (result != null)
            {
                var resultPosition = source;
                var resultText = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
                resultText.setAttribute("class","dss-call");
                resultText.setAttribute("x",resultPosition.x + 22 * direction); 
                resultText.setAttribute("y",resultPosition.y + 6); 
                resultText.setAttribute("dominant-baseline", "hanging");
                if (direction > 0)
                {
                    resultText.setAttribute("text-anchor", "start");
                }
                else
                {
                    resultText.setAttribute("text-anchor", "end");
                }
                resultText.innerHTML = result;
                status.canvas.appendChild(resultText);
            }
            status.currentLine++;
        }
        else
        {
            status.currentSwimlane = targetSwimlaneIndex;
            status.currentLine++;
            this._drawActions(actions.actions, status);

            if (result != null)
            {
                var resultTarget = this._swimLanePos(sourceSwimlaneIndex, status.currentLine);
                var resultSource = this._swimLanePos(targetSwimlaneIndex, status.currentLine);

                resultSource.x -= this.visualConfig.activeLifelineWidth/2 * direction;
                resultTarget.x += this.visualConfig.activeLifelineWidth/2 * direction;

                var resultText = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
                resultText.setAttribute("class","dss-call");
                resultText.setAttribute("x",resultTarget.x + 22 * direction); 
                resultText.setAttribute("y",resultTarget.y + 6); 
                resultText.setAttribute("dominant-baseline", "hanging");
                if (direction > 0)
                {
                    resultText.setAttribute("text-anchor", "start");
                }
                else
                {
                    resultText.setAttribute("text-anchor", "end");
                }
                resultText.innerHTML = result;
                status.canvas.appendChild(resultText);

                var arrowHead2 = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
                var points =    (resultTarget.x + arrowWidth * direction) + " " + (resultTarget.y - arrowHeight/2 * direction) 
                + ", " + (resultTarget.x) + " " + (resultTarget.y) 
                + ", " + (resultTarget.x + arrowWidth * direction) + " " + (resultTarget.y + arrowHeight/2 * direction) 
                arrowHead2.setAttribute("points",points); 
                arrowHead2.setAttribute("class","dss-call");
                status.canvas.appendChild(arrowHead2);

                var resultLine = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                resultLine.setAttribute("x1",resultSource.x - this.visualConfig.activeLifelineWidth/2 * direction); 
                resultLine.setAttribute("y1",resultSource.y); 
                resultLine.setAttribute("x2",resultTarget.x + this.visualConfig.activeLifelineWidth/2 * direction); 
                resultLine.setAttribute("y2",resultTarget.y); 
                resultLine.setAttribute("class","dss-call");
                resultLine.setAttribute("stroke-dasharray","4");
                status.canvas.appendChild(resultLine);

                status.currentLine++;
            }


            status.currentSwimlane = sourceSwimlaneIndex;
        }

        //this._drawActiveSwimlane(startRow, endRow, currentSwimlane);

        

        this._drawActiveSwimlane(targetSwimlaneIndex, startLine, status.currentLine - 1, status);
    },

    _drawActiveSwimlane: function(i_siwmlane, i_startLine, i_endLine, status)
    {
        var startPos = this._swimLanePos(i_siwmlane, i_startLine);
        var endPos = this._swimLanePos(i_siwmlane, i_endLine);
        var delta = this.visualConfig.callSpacing / 6;

        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
        rect.setAttribute("width",this.visualConfig.activeLifelineWidth); 
        rect.setAttribute("height",delta * 2 + endPos.y - startPos.y );
        rect.setAttribute("class","dss-activeswimlane");
        rect.setAttribute("x",startPos.x - this.visualConfig.activeLifelineWidth / 2); 
        rect.setAttribute("y",startPos.y - delta); 
        status.canvas.appendChild(rect);
    },


    _addSwimlane(swimlaneTitle, status)
    {
        var c = 0;
        for (p in status.swimlanesIndex) {
            if (status.swimlanesIndex.hasOwnProperty(p)) {
                c += 1;
            }
        }
        
        var newIndex = c + 1;
        this._drawSwimLane(swimlaneTitle, status.canvas, newIndex);
        status.swimlanesIndex[swimlaneTitle] = newIndex;
        return newIndex;
    },

    _drawSwimLane : function(swimlaneTitle, canvas, swimplaneIdx)
    {
        var pos = this._swimLanePos(swimplaneIdx , -1);
        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
        rect.setAttribute("width",this.visualConfig.headerWidth); 
        rect.setAttribute("height",this.visualConfig.headerHeight);
        rect.setAttribute("class","dss-swimlane");
        rect.setAttribute("x",pos.x - this.visualConfig.headerWidth/2); 
        rect.setAttribute("y",pos.y); 
        canvas.appendChild(rect);

        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a path in SVG's namespace
        text.setAttribute("class","dss-swimlane");
        text.setAttribute("x",pos.x); 
        text.setAttribute("y",pos.y + this.visualConfig.headerHeight/2); 
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("text-decoration", "underline");
        rect.setAttribute("class","dss-swimlane");
        text.innerHTML = swimlaneTitle;
        canvas.appendChild(text);

        var lifeline = document.createElementNS("http://www.w3.org/2000/svg", 'line'); //Create a path in SVG's namespace
        lifeline.setAttribute("x1", pos.x);
        lifeline.setAttribute("y1", pos.y + this.visualConfig.headerHeight);
        lifeline.setAttribute("x2", pos.x);
        lifeline.setAttribute("y2", pos.y + this.visualConfig.headerHeight + 2000);
        lifeline.setAttribute("class","dss-swimlane");
        lifeline.setAttribute("stroke-dasharray","4");
        canvas.appendChild(lifeline);
    },

    _swimLanePos: function(swimplaneIdx, row) //row = -1 equals header
    {
        if (row == -1)
        {
            return  {    
                        "x": 50 + swimplaneIdx * this.visualConfig.swimlaneSpacing,
                        "y" : 50
                    };
        }
        else
        {
            return  {    
                "x": 50 + swimplaneIdx * this.visualConfig.swimlaneSpacing,
                "y" : 50 + 100 + row * this.visualConfig.callSpacing
            };
        }
    },

    _assert: function(cond, text)
    {
        if (!cond)
        {
            alert(text);
        }
    }
}